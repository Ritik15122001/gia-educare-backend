import { Router } from 'express';
import contentRoutes from './content.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import * as settingsCtrl from '../../controllers/settings.controller.js';
import * as sectionCtrl from '../../controllers/section.controller.js';
import * as userCtrl from '../../controllers/user.controller.js';
import * as roleCtrl from '../../controllers/role.controller.js';
import * as dashboardCtrl from '../../controllers/dashboard.controller.js';
import * as uploadCtrl from '../../controllers/upload.controller.js';
import { requireAuth, canManageUsers, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { idParamSchema, listQuerySchema } from '../../validators/common.validators.js';
import { settingsSchema, testEmailSchema } from '../../validators/settings.validators.js';
import { sectionSchema } from '../../validators/content.validators.js';
import { userCreateSchema, userUpdateSchema, roleSchema, roleUpdateSchema } from '../../validators/auth.validators.js';

const router = Router();

// Everything below this line requires a valid access token.
router.use(requireAuth);

// Open to every role; the controller scopes what it returns.
router.get('/dashboard', dashboardCtrl.summary);

// Content collections (destinations, courses, faqs, …)
router.use('/', contentRoutes);

router.use('/enquiries', enquiryRoutes);

// Editable section copy
router.get('/sections', requirePermission('sections.edit'), sectionCtrl.list);
router.post('/sections', requirePermission('sections.edit'), validate(sectionSchema), sectionCtrl.create);
router.get('/sections/:id', requirePermission('sections.edit'), validate(idParamSchema, 'params'), sectionCtrl.get);
router.patch('/sections/:id', requirePermission('sections.edit'), validate(idParamSchema, 'params'), validate(sectionSchema.partial()), sectionCtrl.update);
router.delete('/sections/:id', requirePermission('sections.delete'), validate(idParamSchema, 'params'), sectionCtrl.remove);

// Site settings
router.get('/settings', settingsCtrl.get);
router.patch('/settings', requirePermission('settings.manage'), validate(settingsSchema), settingsCtrl.update);
router.get('/settings/email', requirePermission('settings.manage'), settingsCtrl.getEmailStatus);
router.post('/settings/email/test', requirePermission('settings.manage'), validate(testEmailSchema), settingsCtrl.sendTestEmail);

// Media library — image fields on content, sections and settings upload through here too.
const canUseMedia = requirePermission('media.upload', 'content.manage', 'sections.edit', 'settings.manage');
router.get('/uploads', canUseMedia, uploadCtrl.list);
router.post('/uploads', canUseMedia, uploadCtrl.uploadMiddleware, uploadCtrl.upload);
router.delete('/uploads/:filename', requirePermission('media.delete'), uploadCtrl.remove);

// Team accounts
router.get('/users', canManageUsers, validate(listQuerySchema, 'query'), userCtrl.list);
router.post('/users', canManageUsers, validate(userCreateSchema), userCtrl.create);
router.patch('/users/:id', canManageUsers, validate(idParamSchema, 'params'), validate(userUpdateSchema), userCtrl.update);
router.delete('/users/:id', canManageUsers, validate(idParamSchema, 'params'), userCtrl.remove);

// Roles & permissions
router.get('/roles', canManageUsers, roleCtrl.list);
router.post('/roles', canManageUsers, validate(roleSchema), roleCtrl.create);
router.patch('/roles/:id', canManageUsers, validate(idParamSchema, 'params'), validate(roleUpdateSchema), roleCtrl.update);
router.delete('/roles/:id', canManageUsers, validate(idParamSchema, 'params'), roleCtrl.remove);

export default router;
