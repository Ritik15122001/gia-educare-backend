import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../services/token.service.js';

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
  return next();
});

// Usage: requireRole('super_admin', 'admin')
export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Your role does not allow this action'));
  }
  return next();
};

// Editors can manage content but not users or destructive settings.
export const canWriteContent = requireRole('super_admin', 'admin', 'editor');
export const canManageUsers = requireRole('super_admin');
