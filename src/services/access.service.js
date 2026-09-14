import { Role } from '../models/Role.js';
import { DEFAULT_ROLES, PERMISSIONS, SUPER_ADMIN } from '../lib/permissions.js';
import { logger } from '../config/logger.js';

/** Inserts any missing default role. Never touches roles that already exist. */
export async function ensureDefaultRoles() {
  const results = await Promise.all(
    DEFAULT_ROLES.map((role) => Role.updateOne({ key: role.key }, { $setOnInsert: role }, { upsert: true })),
  );
  const created = results.reduce((n, r) => n + (r.upsertedCount || 0), 0);
  if (created) logger.info(`Roles            ${created} default role(s) created`);
}

/**
 * What a user may do, resolved from their role on every request so a change to
 * a role applies immediately. Super admin is hardcoded to everything, so a bad
 * edit to the roles collection can never lock the owner out.
 */
export async function resolveAccess(user) {
  const role = await Role.findOne({ key: user.role }).lean();

  if (user.role === SUPER_ADMIN) {
    return { roleName: role?.name || 'Super admin', permissions: PERMISSIONS, leadScope: 'all', superAdmin: true };
  }
  if (!role) return { roleName: user.role, permissions: [], leadScope: 'assigned', superAdmin: false };

  return { roleName: role.name, permissions: role.permissions, leadScope: role.leadScope, superAdmin: false };
}

// Built-in roles in ladder order, then custom roles oldest first. (The defaults are
// inserted together, so createdAt alone can't order them.)
const DEFAULT_ORDER = DEFAULT_ROLES.map((r) => r.key);
export const sortRoles = (roles) => [...roles].sort((a, b) => {
  const ia = DEFAULT_ORDER.indexOf(a.key);
  const ib = DEFAULT_ORDER.indexOf(b.key);
  if (ia !== ib) return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
  return new Date(a.createdAt) - new Date(b.createdAt);
});

export const hasPermission = (access, ...perms) => perms.some((p) => access?.permissions.includes(p));

/**
 * Mongo filter restricting enquiries to what the current user may see.
 * `assigned` scope = assigned to them personally, or to their role.
 */
export function leadScopeFilter(req) {
  const { access, user } = req;
  if (!hasPermission(access, 'leads.view')) return { _id: null };
  if (access.leadScope === 'all') return {};
  return { $or: [{ assignedTo: user._id }, { assignedRole: user.role }] };
}

/** The user object the admin panel keeps in its session. */
export async function sessionUser(user, access) {
  const resolved = access || (await resolveAccess(user));
  return {
    ...user.toJSON(),
    roleName: resolved.roleName,
    permissions: resolved.permissions,
    leadScope: resolved.leadScope,
  };
}
