import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { loginSchema, changePasswordSchema, updateProfileSchema } from '../validators/auth.validators.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', requireAuth, ctrl.me);
router.patch('/me', requireAuth, validate(updateProfileSchema), ctrl.updateProfile);
router.post('/change-password', requireAuth, validate(changePasswordSchema), ctrl.changePassword);

export default router;
