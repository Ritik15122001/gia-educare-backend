import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES },
  );
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

export const hashToken = (token) => bcrypt.hash(token, 10);
export const compareToken = (token, hash) => bcrypt.compare(token, hash);

// Refresh token lives in an httpOnly cookie so page JS can never read it.
export const REFRESH_COOKIE = 'gia_refresh';

// SameSite=None + Secure is required whenever the admin panel and this API are
// on different domains — otherwise the browser drops the cookie and every
// refresh (page reload, token expiry) fails. Both are env-driven so a
// same-origin deployment can tighten them back to `lax`/`strict`.
export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
