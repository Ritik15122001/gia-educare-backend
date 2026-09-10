import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const base = { standardHeaders: true, legacyHeaders: false, skip: () => env.NODE_ENV === 'test' };

// Generous ceiling for normal browsing / admin work.
export const generalLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 600 });

// Tight limits on the endpoints that are worth abusing.
export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many login attempts. Try again in a few minutes.' },
});

export const enquiryLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { success: false, message: 'Too many enquiries from this address. Please try again later.' },
});
