import { Router } from 'express';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import adminRoutes from './admin/index.js';
import { createChallenge } from '../services/captcha.service.js';
import { captchaLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }),
);

// A fresh arithmetic captcha for any form that requires one. The answer stays
// on the server, HMAC-signed into the single-use token.
router.get('/captcha', captchaLimiter, (_req, res) => {
  const { token, svg, expiresAt } = createChallenge();
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, data: { token, svg, expiresAt } });
});

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);

export default router;
