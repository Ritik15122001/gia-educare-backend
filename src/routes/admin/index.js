import { Router } from 'express';
import contentRoutes from './content.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import * as settingsCtrl from '../../controllers/settings.controller.js';
import * as sectionCtrl from '../../controllers/section.controller.js';
import * as userCtrl from '../../controllers/user.controller.js';
import * as dashboardCtrl from '../../controllers/dashboard.controller.js';
import * as uploadCtrl from '../../controllers/upload.controller.js';
import { requireAuth, canManageUsers, canWriteContent, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { idParamSchema, listQuerySchema } from '../../validators/common.validators.js';
import { settingsSchema } from '../../validators/settings.validators.js';
import { sectionSchema } from '../../validators/content.validators.js';
import { userCreateSchema, userUpdateSchema } from '../../validators/auth.validators.js';

const router = Router();

// Everything below this line requires a valid access token.
router.use(requireAuth);

router.get('/dashboard', dashboardCtrl.summary);

// Content collections (destinations, courses, faqs, …)
router.use('/', contentRoutes);

router.use('/enquiries', enquiryRoutes);

// Editable section copy
router.get('/sections', canWriteContent, sectionCtrl.list);
router.post('/sections', canWriteContent, validate(sectionSchema), sectionCtrl.create);
router.get('/sections/:id', canWriteContent, validate(idParamSchema, 'params'), sectionCtrl.get);
router.patch('/sections/:id', canWriteContent, validate(idParamSchema, 'params'), validate(sectionSchema.partial()), sectionCtrl.update);
router.delete('/sections/:id', requireRole('super_admin', 'admin'), validate(idParamSchema, 'params'), sectionCtrl.remove);

// Site settings
router.get('/settings', settingsCtrl.get);
router.patch('/settings', requireRole('super_admin', 'admin'), validate(settingsSchema), settingsCtrl.update);

// Media library
router.get('/uploads', canWriteContent, uploadCtrl.list);
router.post('/uploads', canWriteContent, uploadCtrl.uploadMiddleware, uploadCtrl.upload);
router.delete('/uploads/:filename', requireRole('super_admin', 'admin'), uploadCtrl.remove);

// Team accounts
router.get('/users', canManageUsers, validate(listQuerySchema, 'query'), userCtrl.list);
router.post('/users', canManageUsers, validate(userCreateSchema), userCtrl.create);
router.patch('/users/:id', canManageUsers, validate(idParamSchema, 'params'), validate(userUpdateSchema), userCtrl.update);
router.delete('/users/:id', canManageUsers, validate(idParamSchema, 'params'), userCtrl.remove);

export default router;
