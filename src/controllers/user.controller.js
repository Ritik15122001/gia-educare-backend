import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parseListQuery(req.query, { defaultSort: '-createdAt' });
  const filter = req.query.search
    ? { $or: [{ name: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') }] }
    : {};

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return ok(res, items, buildMeta({ page, limit, total }));
});

export const create = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw ApiError.conflict('An account with that email already exists');

  const user = await User.create(req.body);
  await recordAudit({ req, action: 'create', resource: 'users', resourceId: user.id, summary: `Created user ${user.email}` });
  return created(res, user);
});

export const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw ApiError.notFound('User not found');

  // Never let the last super admin lock everyone out.
  if (user.role === 'super_admin' && (req.body.role !== 'super_admin' || req.body.active === false)) {
    const supers = await User.countDocuments({ role: 'super_admin', active: true });
    if (supers <= 1) throw ApiError.badRequest('There must be at least one active super admin');
  }

  Object.assign(user, req.body);
  await user.save();
  await recordAudit({ req, action: 'update', resource: 'users', resourceId: user.id, summary: `Updated user ${user.email}` });
  return ok(res, user.toJSON());
});

export const remove = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) throw ApiError.badRequest('You cannot delete your own account');

  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'super_admin') {
    const supers = await User.countDocuments({ role: 'super_admin', active: true });
    if (supers <= 1) throw ApiError.badRequest('There must be at least one active super admin');
  }

  await user.deleteOne();
  await recordAudit({ req, action: 'delete', resource: 'users', resourceId: user.id, summary: `Deleted user ${user.email}` });
  return noContent(res);
});
