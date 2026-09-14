import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../services/token.service.js';
import { resolveAccess, hasPermission } from '../services/access.service.js';
import { SUPER_ADMIN } from '../lib/permissions.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw ApiError.unauthorized('Sign in to continue');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized(err.name === 'TokenExpiredError' ? 'Session expired' : 'Invalid session');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.active) throw ApiError.unauthorized('Account is no longer active');

  req.user = user;
  req.access = await resolveAccess(user);
  return next();
});

// Passes if the user's role grants ANY of the listed permissions.
// Usage: requirePermission('leads.edit', 'leads.assign')
export const requirePermission = (...perms) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!hasPermission(req.access, ...perms)) {
    return next(ApiError.forbidden('Your role does not allow this action'));
  }
  return next();
};

// Team accounts and roles are never grantable, so no role can raise its own access.
export const canManageUsers = (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (req.user.role !== SUPER_ADMIN) return next(ApiError.forbidden('Only a super admin can do this'));
  return next();
};
