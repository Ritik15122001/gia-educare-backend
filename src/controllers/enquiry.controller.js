import { Enquiry, ENQUIRY_STATUSES } from '../models/Enquiry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';
import { logger } from '../config/logger.js';

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

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parseListQuery(req.query, { defaultSort: '-createdAt' });
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.destination) filter.destination = req.query.destination;
  if (req.query.search) {
    const rx = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }];
  }
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(`${req.query.to}T23:59:59.999Z`);
  }

  const [items, total, statusCounts] = await Promise.all([
    Enquiry.find(filter).sort(sort).skip(skip).limit(limit).populate('assignedTo', 'name email'),
    Enquiry.countDocuments(filter),
    Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const counts = ENQUIRY_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  statusCounts.forEach(({ _id, count }) => { counts[_id] = count; });

  return ok(res, items, { ...buildMeta({ page, limit, total }), counts });
});

export const get = asyncHandler(async (req, res) => {
  const doc = await Enquiry.findById(req.params.id).populate('assignedTo', 'name email');
  if (!doc) throw ApiError.notFound('Enquiry not found');
  return ok(res, doc);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('assignedTo', 'name email');
  if (!doc) throw ApiError.notFound('Enquiry not found');
  await recordAudit({ req, action: 'update', resource: 'enquiries', resourceId: doc.id, summary: `Enquiry ${doc.email} → ${doc.status}` });
  return ok(res, doc);
});

export const addNote = asyncHandler(async (req, res) => {
  const doc = await Enquiry.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Enquiry not found');

  doc.notes.push({ body: req.body.body, author: req.user.id, authorName: req.user.name });
  await doc.save();
  return ok(res, doc);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await Enquiry.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Enquiry not found');
  await recordAudit({ req, action: 'delete', resource: 'enquiries', resourceId: doc.id, summary: `Deleted enquiry ${doc.email}` });
  return noContent(res);
});

// CSV export for the sales team.
export const exportCsv = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const rows = await Enquiry.find(filter).sort('-createdAt').limit(5000);

  const headers = ['Created', 'Name', 'Email', 'Phone', 'Destination', 'Level', 'Intake', 'Test', 'Qualification', 'Status', 'Message'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [
    headers.join(','),
    ...rows.map((r) => [
      r.createdAt.toISOString(),
      r.name, r.email, `${r.code} ${r.phone}`, r.destination, r.level, r.intake, r.test, r.qual, r.status, r.message,
    ].map(escape).join(',')),
  ].join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment(`gia-enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
  return res.send(csv);
});
