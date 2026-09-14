import slugify from 'slugify';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';
import { Enquiry } from '../models/Enquiry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { recordAudit } from '../models/AuditLog.js';
import { MODULE_GROUPS, ACTIONS, LEAD_SCOPES, SUPER_ADMIN } from '../lib/permissions.js';
import { sortRoles } from '../services/access.service.js';

// Roles with their member counts, plus the permission catalog the editor renders.
export const list = asyncHandler(async (_req, res) => {
  const [roles, counts] = await Promise.all([
    Role.find(),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  const items = sortRoles(roles).map((r) => ({ ...r.toJSON(), userCount: countMap[r.key] || 0 }));
  return ok(res, items, { moduleGroups: MODULE_GROUPS, actions: ACTIONS, leadScopes: LEAD_SCOPES });
});

export const create = asyncHandler(async (req, res) => {
  const key = slugify(req.body.name, { lower: true, strict: true, replacement: '_' });
  if (!key) throw ApiError.badRequest('Choose a name with letters or numbers');
  if (await Role.exists({ key })) throw ApiError.conflict('A role with that name already exists');

  const role = await Role.create({ ...req.body, key, system: false });
  await recordAudit({ req, action: 'create', resource: 'roles', resourceId: role.id, summary: `Created role ${role.name}` });
  return created(res, { ...role.toJSON(), userCount: 0 });
});

export const update = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) throw ApiError.notFound('Role not found');
  if (role.key === SUPER_ADMIN) throw ApiError.badRequest('The super admin role always has full access and cannot be edited');

  // `key` is immutable: users and assigned leads point at it.
  Object.assign(role, req.body);
  await role.save();
  await recordAudit({ req, action: 'update', resource: 'roles', resourceId: role.id, summary: `Updated role ${role.name}` });
  return ok(res, { ...role.toJSON(), userCount: await User.countDocuments({ role: role.key }) });
});

export const remove = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) throw ApiError.notFound('Role not found');
  if (role.system) throw ApiError.badRequest('Built-in roles cannot be deleted');

  const members = await User.countDocuments({ role: role.key });
  if (members) {
    throw ApiError.badRequest(`${members} account(s) still have this role — move them to another role first`);
  }

  // Leads keep their assigned person; only the role link is dropped.
  await Enquiry.updateMany({ assignedRole: role.key }, { $set: { assignedRole: '' } });
  await role.deleteOne();
  await recordAudit({ req, action: 'delete', resource: 'roles', resourceId: role.id, summary: `Deleted role ${role.name}` });
  return noContent(res);
});
