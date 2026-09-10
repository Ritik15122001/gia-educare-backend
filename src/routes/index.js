import { Router } from 'express';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import adminRoutes from './admin/index.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }),
);

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);

export default router;
