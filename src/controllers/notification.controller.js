import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { unreadCount } from '../services/notification.service.js';

// Everyone reads their own feed — no permission gate beyond being signed in.
const mine = (req, extra = {}) => ({ user: req.user._id, ...extra });

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseListQuery(req.query, { defaultSort: '-createdAt' });
  const filter = mine(req, req.query.unread === 'true' ? { read: false } : {});

  const [items, total, unread] = await Promise.all([
    Notification.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Notification.countDocuments(filter),
    unreadCount(req.user._id),
  ]);
  return ok(res, items, { ...buildMeta({ page, limit, total }), unread });
});

export const markRead = asyncHandler(async (req, res) => {
  const doc = await Notification.findOne(mine(req, { _id: req.params.id }));
  if (!doc) throw ApiError.notFound('Notification not found');
  if (!doc.read) {
    doc.read = true;
    doc.readAt = new Date();
    await doc.save();
  }
  return ok(res, doc, { unread: await unreadCount(req.user._id) });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(mine(req, { read: false }), { $set: { read: true, readAt: new Date() } });
  return ok(res, { updated: true }, { unread: 0 });
});

export const clearRead = asyncHandler(async (req, res) => {
  await Notification.deleteMany(mine(req, { read: true }));
  return noContent(res);
});
