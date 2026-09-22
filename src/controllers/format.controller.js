import { MessageFormat, FORMAT_CHANNELS, FORMAT_PLACEHOLDERS, CHANNEL_KEYS } from '../models/MessageFormat.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';

/**
 * "Important formats" — the approved wording the team reuses. Hand-written
 * rather than a registry resource, because registry collections are served
 * publicly by /public/:resource and these are internal.
 */

// The channel list, the tokens a format may use and their sample values. The
// admin renders its preview from this, so the catalog has one home.
export const options = asyncHandler(async (_req, res) =>
  ok(res, { channels: FORMAT_CHANNELS, placeholders: FORMAT_PLACEHOLDERS }));

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parseListQuery(req.query, { defaultSort: 'order -createdAt' });
  const filter = {};

  if (req.query.channel && CHANNEL_KEYS.includes(req.query.channel)) filter.channel = req.query.channel;
  if (req.query.search) {
    const rx = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { body: rx }, { subject: rx }, { description: rx }, { tags: rx }];
  }

  const [items, total, channelCounts] = await Promise.all([
    MessageFormat.find(filter).sort(sort).skip(skip).limit(limit),
    MessageFormat.countDocuments(filter),
    // Chips count everything, not just the current filter.
    MessageFormat.aggregate([{ $group: { _id: '$channel', count: { $sum: 1 } } }]),
  ]);

  const counts = CHANNEL_KEYS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
  channelCounts.forEach(({ _id, count }) => { if (_id in counts) counts[_id] = count; });

  return ok(res, items, { ...buildMeta({ page, limit, total }), counts });
});

export const get = asyncHandler(async (req, res) => {
  const doc = await MessageFormat.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Format not found');
  return ok(res, doc);
});

export const create = asyncHandler(async (req, res) => {
  const doc = await MessageFormat.create({
    ...req.body,
    // Only an email carries a subject; drop a stale one if the channel changed.
    subject: req.body.channel === 'email' ? req.body.subject : '',
    createdBy: req.user?._id ?? null,
    createdByName: req.user?.name ?? '',
    updatedByName: req.user?.name ?? '',
  });
  await recordAudit({ req, action: 'create', resource: 'formats', resourceId: doc.id, summary: `Added format "${doc.title}"` });
  return created(res, doc);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await MessageFormat.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Format not found');

  Object.assign(doc, req.body);
  if (doc.channel !== 'email') doc.subject = '';
  doc.updatedByName = req.user?.name ?? '';

  await doc.save();
  await recordAudit({ req, action: 'update', resource: 'formats', resourceId: doc.id, summary: `Updated format "${doc.title}"` });
  return ok(res, doc);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await MessageFormat.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Format not found');
  await recordAudit({ req, action: 'delete', resource: 'formats', resourceId: doc.id, summary: `Deleted format "${doc.title}"` });
  return noContent(res);
});
