import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { recordAudit } from '../models/AuditLog.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  compareToken,
  REFRESH_COOKIE,
  refreshCookieOptions,
} from '../services/token.service.js';

async function issueTokens(user, res) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  return accessToken;
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Email or password is incorrect');
  }
  if (!user.active) throw ApiError.forbidden('This account has been deactivated');

  user.lastLoginAt = new Date();
  const accessToken = await issueTokens(user, res);
  await recordAudit({ req: { user }, action: 'login', resource: 'auth', summary: `${user.email} signed in` });

  return ok(res, { accessToken, user: user.toJSON() });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('No refresh token');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Refresh token is invalid or expired');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user || !user.active || !user.refreshTokenHash) throw ApiError.unauthorized('Session no longer valid');
  if (!(await compareToken(token, user.refreshTokenHash))) {
    // Token reuse — drop the stored session entirely.
    user.refreshTokenHash = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.unauthorized('Session no longer valid');
  }

  const accessToken = await issueTokens(user, res);
  return ok(res, { accessToken, user: user.toJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: 1 } });
    } catch {
      // Already invalid — nothing to revoke.
    }
  }
  res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions, maxAge: undefined });
  return ok(res, { message: 'Signed out' });
});

export const me = asyncHandler(async (req, res) => ok(res, req.user.toJSON()));

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const clash = await User.findOne({ email, _id: { $ne: req.user.id } });
  if (clash) throw ApiError.conflict('Another account already uses that email');

  req.user.name = name;
  req.user.email = email;
  await req.user.save();
  return ok(res, req.user.toJSON());
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect');
  }
  user.password = newPassword;
  user.refreshTokenHash = undefined; // force other sessions to re-authenticate
  await user.save();
  return ok(res, { message: 'Password updated' });
});
