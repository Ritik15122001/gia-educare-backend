import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { logger } from '../config/logger.js';
import { SUPER_ADMIN } from '../lib/permissions.js';

/**
 * In-CRM notifications. Every write is fire-and-forget: a notification must
 * never fail the action it describes, exactly like the audit log.
 */

/** Active users whose role can see leads — super admin always included. */
export async function leadAudience({ assignedRole = '', assignedTo = null } = {}) {
  const roles = await Role.find({ $or: [{ key: SUPER_ADMIN }, { permissions: 'leads.view' }] }).select('key leadScope').lean();
  const keys = roles.map((r) => r.key);
  // Someone who only sees their own leads should not hear about everyone's.
  const scopedOut = roles.filter((r) => r.leadScope === 'assigned' && r.key !== assignedRole).map((r) => r.key);
  const users = await User.find({ active: true, role: { $in: keys } }).select('_id name email role').lean();
  return users.filter((u) => !scopedOut.includes(u.role) || String(u._id) === String(assignedTo));
}

export async function notifyUsers(users, { type, title, body = '', link = '' }) {
  const list = (users || []).filter(Boolean);
  if (!list.length) return 0;
  try {
    await Notification.insertMany(
      list.map((u) => ({ user: u._id || u, type, title, body, link })),
      { ordered: false },
    );
    return list.length;
  } catch (err) {
    logger.error(`[notify] could not write notifications: ${err.message}`);
    return 0;
  }
}

/** Fire-and-forget wrapper — the caller never waits or fails on this. */
export function queueNotification(run) {
  setImmediate(() => {
    Promise.resolve()
      .then(run)
      .catch((err) => logger.error(`[notify] ${err.message}`));
  });
}

export const unreadCount = (userId) => Notification.countDocuments({ user: userId, read: false });
