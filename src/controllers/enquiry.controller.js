import { Enquiry, ENQUIRY_STATUSES } from '../models/Enquiry.js';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';
import { logger } from '../config/logger.js';
import { manualLeadSchema } from '../validators/enquiry.validators.js';
import { queueLeadNotifications } from '../services/email.service.js';
import { leadScopeFilter, hasPermission, sortRoles } from '../services/access.service.js';
import { SUPER_ADMIN } from '../lib/permissions.js';

// --- public ---------------------------------------------------------------

export const submit = asyncHandler(async (req, res) => {
  const { company, ...payload } = req.body;
  // Silently accept honeypot hits so bots do not learn they were caught.
  if (company) return created(res, { id: null, message: 'Thanks — we will be in touch.' });

  const enquiry = await Enquiry.create({
    ...payload,
    ip: req.ip,
    userAgent: req.get('user-agent') || '',
  });

  logger.info(`New enquiry from ${enquiry.email} (${enquiry.destination || 'no destination'})`);

  // Team alert + student confirmation go out after the response, per the
  // switches in Admin → Email & SMTP. A mail failure never fails the lead.
  queueLeadNotifications(enquiry);

  // Only echo back what the success screen needs — never the whole record.
  return created(res, {
    id: enquiry.id,
    name: enquiry.name,
    email: enquiry.email,
    destination: enquiry.destination,
    message: 'Thanks — a counsellor will call you within one working day.',
  });
});

// --- admin ----------------------------------------------------------------

const ASSIGNEE_FIELDS = 'name email role';

// Combines a request filter with the user's lead scope without clobbering either's $or.
const scoped = (req, filter = {}) => {
  const scope = leadScopeFilter(req);
  return Object.keys(scope).length ? { $and: [scope, filter] } : filter;
};

// assignedRole is a Role key; attach its display name for the admin.
async function withRoleNames(docs) {
  const roles = await Role.find().select('key name').lean();
  const names = Object.fromEntries(roles.map((r) => [r.key, r.name]));
  const shape = (d) => ({ ...d.toJSON(), assignedRoleName: names[d.assignedRole] || '' });
  return Array.isArray(docs) ? docs.map(shape) : shape(docs);
}

const findScoped = (req) => Enquiry.findOne(scoped(req, { _id: req.params.id }));

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parseListQuery(req.query, { defaultSort: '-createdAt' });
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.destination) filter.destination = req.query.destination;
  if (req.query.budget) filter.budget = req.query.budget;
  // referral=any → every referred lead; anything else matches that code exactly.
  if (req.query.referral === 'any') filter.referral = { $ne: '' };
  else if (req.query.referral) filter.referral = req.query.referral;
  if (req.query.search) {
    const rx = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }, { referral: rx }];
  }
  if (req.query.assignedTo === 'me') filter.assignedTo = req.user._id;
  else if (req.query.assignedTo === 'none') {
    filter.assignedTo = null;
    filter.assignedRole = { $in: ['', null] };
  } else if (/^[0-9a-f]{24}$/i.test(req.query.assignedTo || '')) filter.assignedTo = req.query.assignedTo;
  if (req.query.assignedRole) filter.assignedRole = req.query.assignedRole;
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(`${req.query.to}T23:59:59.999Z`);
  }

  const query = scoped(req, filter);
  const [items, total, statusCounts] = await Promise.all([
    Enquiry.find(query).sort(sort).skip(skip).limit(limit).populate('assignedTo', ASSIGNEE_FIELDS),
    Enquiry.countDocuments(query),
    // Pipeline chips count everything the user can see, regardless of the other filters.
    Enquiry.aggregate([{ $match: leadScopeFilter(req) }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const counts = ENQUIRY_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  statusCounts.forEach(({ _id, count }) => { counts[_id] = count; });

  return ok(res, await withRoleNames(items), { ...buildMeta({ page, limit, total }), counts });
});

export const get = asyncHandler(async (req, res) => {
  const doc = await findScoped(req).populate('assignedTo', ASSIGNEE_FIELDS);
  if (!doc) throw ApiError.notFound('Enquiry not found');
  return ok(res, await withRoleNames(doc));
});

// Roles that can see leads, and the active people in each — for the assign picker.
export const assignees = asyncHandler(async (_req, res) => {
  const roles = sortRoles(
    await Role.find({ $or: [{ key: SUPER_ADMIN }, { permissions: 'leads.view' }] }).select('key name leadScope createdAt'),
  );
  const users = await User.find({ active: true, role: { $in: roles.map((r) => r.key) } })
    .sort('name')
    .select('name email role');
  return ok(res, { roles, users });
});

export const update = asyncHandler(async (req, res) => {
  const doc = await findScoped(req);
  if (!doc) throw ApiError.notFound('Enquiry not found');

  const changes = [];

  if (req.body.status !== undefined && req.body.status !== doc.status) {
    if (!hasPermission(req.access, 'leads.edit')) throw ApiError.forbidden('Your role cannot change lead status');
    doc.status = req.body.status;
    changes.push(`status → ${doc.status}`);
  }

  if (req.body.assignedRole !== undefined || req.body.assignedTo !== undefined) {
    if (!hasPermission(req.access, 'leads.assign')) throw ApiError.forbidden('Your role cannot assign leads');

    let role = req.body.assignedRole ?? doc.assignedRole ?? '';
    let person = req.body.assignedTo === undefined ? doc.assignedTo : req.body.assignedTo;
    let personDoc = null;

    if (person) {
      personDoc = await User.findOne({ _id: person, active: true });
      if (!personDoc) throw ApiError.badRequest('That team member does not exist or is deactivated');
      // Picking a person without a role files the lead under their role.
      if (!role) role = personDoc.role;
      else if (personDoc.role !== role) {
        // Role changed and the old person isn't in it: drop them rather than fail.
        if (req.body.assignedTo === undefined) { person = null; personDoc = null; }
        else throw ApiError.badRequest(`${personDoc.name} is not in that role`);
      }
    }

    if (role) {
      const roleDoc = await Role.findOne({ key: role });
      if (!roleDoc) throw ApiError.badRequest('That role does not exist');
      if (role !== SUPER_ADMIN && !roleDoc.permissions.includes('leads.view')) {
        throw ApiError.badRequest(`The ${roleDoc.name} role cannot view leads — give it "View enquiries" first`);
      }
    }

    const personId = personDoc?._id ?? null;
    if (role !== (doc.assignedRole || '') || String(personId) !== String(doc.assignedTo ?? null)) {
      doc.assignedRole = role;
      doc.assignedTo = personId;
      doc.assignedBy = role || personId ? req.user._id : null;
      doc.assignedAt = role || personId ? new Date() : null;
      changes.push(role || personId ? `assigned to ${[role, personDoc?.name].filter(Boolean).join(' / ')}` : 'unassigned');
    }
  }

  if (changes.length) {
    // Older leads may predate a validator change; only check what we touched.
    await doc.save({ validateModifiedOnly: true });
    await recordAudit({ req, action: 'update', resource: 'enquiries', resourceId: doc.id, summary: `Enquiry ${doc.email}: ${changes.join(', ')}` });
  }

  await doc.populate('assignedTo', ASSIGNEE_FIELDS);
  return ok(res, await withRoleNames(doc));
});

export const addNote = asyncHandler(async (req, res) => {
  const doc = await findScoped(req);
  if (!doc) throw ApiError.notFound('Enquiry not found');

  doc.notes.push({ body: req.body.body, author: req.user.id, authorName: req.user.name });
  await doc.save();
  await doc.populate('assignedTo', ASSIGNEE_FIELDS);
  return ok(res, await withRoleNames(doc));
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await findScoped(req);
  if (!doc) throw ApiError.notFound('Enquiry not found');
  await doc.deleteOne();
  await recordAudit({ req, action: 'delete', resource: 'enquiries', resourceId: doc.id, summary: `Deleted enquiry ${doc.email}` });
  return noContent(res);
});

// CSV export for the sales team.
export const exportCsv = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const rows = await Enquiry.find(scoped(req, filter)).sort('-createdAt').limit(5000).populate('assignedTo', 'name');

  const headers = [
    'Created', 'Name', 'Email', 'Phone', 'Destination', 'Budget', 'Level', 'Intake', 'Test', 'Qualification',
    'Status', 'Assigned role', 'Assigned to', 'Referral', 'UTM source', 'UTM medium', 'UTM campaign', 'Came from', 'Message',
  ];
  const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  // Free-text lead fields are user input: neutralise cells Excel would evaluate
  // as formulas. The phone column is exempt — the validator reduces it to
  // "+<digits> <digits>", and prefixing it would mangle every number.
  const escape = (v) => {
    const text = String(v ?? '');
    return quote(/^[=+\-@\t\r]/.test(text) ? `'${text}` : text);
  };
  const csv = [
    headers.join(','),
    ...rows.map((r) => [
      escape(r.createdAt.toISOString()),
      escape(r.name), escape(r.email), quote(`${r.code} ${r.phone}`), escape(r.destination), escape(r.budget),
      escape(r.level), escape(r.intake), escape(r.test), escape(r.qual), escape(r.status), escape(r.assignedRole), escape(r.assignedTo?.name), escape(r.referral),
      escape(r.utmSource), escape(r.utmMedium), escape(r.utmCampaign), escape(r.sourcePage), escape(r.message),
    ].join(',')),
  ].join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment(`gia-enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
  return res.send(csv);
});


// --- staff-created leads ---------------------------------------------------

export const create = asyncHandler(async (req, res) => {
  const doc = await Enquiry.create({
    ...req.body,
    source: req.body.source || 'manual',
    createdBy: req.user?.id,
  });
  await recordAudit({ req, action: 'create', resource: 'enquiries', resourceId: doc.id, summary: `Added lead ${doc.email}` });
  return created(res, doc);
});

/**
 * Bulk import from a spreadsheet.
 *
 * Every row is validated on its own so one bad line cannot sink the file: the
 * good rows import and the bad ones come back with the row number and reason
 * for the person to fix. Existing leads are matched on email or phone.
 */
export const importLeads = asyncHandler(async (req, res) => {
  const { rows, duplicates, source } = req.body;

  const valid = [];
  const failed = [];

  rows.forEach((raw, index) => {
    const parsed = manualLeadSchema.safeParse(raw);
    if (parsed.success) {
      valid.push({ ...parsed.data, source: raw.source || source });
    } else {
      failed.push({
        row: index + 2, // +2: header row plus 1-based counting, matching the spreadsheet
        name: raw.name || raw.email || '(blank)',
        errors: parsed.error.issues.map((i) => `${i.path.join('.') || 'row'}: ${i.message}`),
      });
    }
  });

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const lead of valid) {
    const existing = await Enquiry.findOne({ $or: [{ email: lead.email }, { phone: lead.phone }] });

    if (!existing) {
      await Enquiry.create({ ...lead, createdBy: req.user?.id });
      imported += 1;
      continue;
    }

    if (duplicates === 'update') {
      Object.assign(existing, lead);
      await existing.save();
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  await recordAudit({
    req,
    action: 'create',
    resource: 'enquiries',
    summary: `Imported ${imported} lead(s), updated ${updated}, skipped ${skipped}`,
  });

  logger.info(`Lead import: ${imported} new, ${updated} updated, ${skipped} duplicates, ${failed.length} invalid`);

  return ok(res, { imported, updated, skipped, failed, totalRows: rows.length });
});
