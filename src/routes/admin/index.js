import { Router } from 'express';
import contentRoutes from './content.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import financeRoutes from './finance.routes.js';
import * as settingsCtrl from '../../controllers/settings.controller.js';
import * as emailCtrl from '../../controllers/email.controller.js';
import * as sectionCtrl from '../../controllers/section.controller.js';
import * as userCtrl from '../../controllers/user.controller.js';
import * as roleCtrl from '../../controllers/role.controller.js';
import * as dashboardCtrl from '../../controllers/dashboard.controller.js';
import * as notificationCtrl from '../../controllers/notification.controller.js';
import * as uploadCtrl from '../../controllers/upload.controller.js';
import { requireAuth, canManageUsers, requirePermission } from '../../middleware/auth.js';
import { hasPermission, canEditSomething } from '../../services/access.service.js';
import { validate } from '../../middleware/validate.js';
import { idParamSchema, listQuerySchema } from '../../validators/common.validators.js';
import { settingsSchema } from '../../validators/settings.validators.js';
import { emailConfigSchema, smtpVerifySchema, testEmailSchema } from '../../validators/email.validators.js';
import { sectionSchema } from '../../validators/content.validators.js';
import { userCreateSchema, userUpdateSchema, roleSchema, roleUpdateSchema } from '../../validators/auth.validators.js';

const router = Router();

// Everything below this line requires a valid access token.
router.use(requireAuth);

// Open to every role; the controller scopes what it returns.
router.get('/dashboard', dashboardCtrl.summary);

// Notifications are personal: every signed-in user reads and clears their own.
router.get('/notifications', validate(listQuerySchema, 'query'), notificationCtrl.list);
router.post('/notifications/read-all', notificationCtrl.markAllRead);
router.delete('/notifications/read', notificationCtrl.clearRead);
router.patch('/notifications/:id/read', validate(idParamSchema, 'params'), notificationCtrl.markRead);

// Content collections (destinations, courses, faqs, …)
router.use('/', contentRoutes);

router.use('/enquiries', enquiryRoutes);

// Expenses, income and the P&L statement — hand-written, never public.
router.use('/finance', financeRoutes);

// Editable section copy
const canViewSections = requirePermission('sections.view', 'sections.edit');
const canEditSections = requirePermission('sections.edit');
router.get('/sections', canViewSections, sectionCtrl.list);
router.post('/sections', canEditSections, validate(sectionSchema), sectionCtrl.create);
router.get('/sections/:id', canViewSections, validate(idParamSchema, 'params'), sectionCtrl.get);
router.patch('/sections/:id', canEditSections, validate(idParamSchema, 'params'), validate(sectionSchema.partial()), sectionCtrl.update);
router.delete('/sections/:id', requirePermission('sections.delete'), validate(idParamSchema, 'params'), sectionCtrl.remove);

// Site settings
router.get('/settings', requirePermission('settings.view', 'settings.edit'), settingsCtrl.get);
router.patch('/settings', requirePermission('settings.edit'), validate(settingsSchema), settingsCtrl.update);
// Email & SMTP — credentials, lead notification switches, delivery log, previews
const canManageEmail = requirePermission('settings.edit');
router.get('/settings/email', requirePermission('settings.view', 'settings.edit'), emailCtrl.get);
router.put('/settings/email', canManageEmail, validate(emailConfigSchema), emailCtrl.update);
router.post('/settings/email/verify', canManageEmail, validate(smtpVerifySchema), emailCtrl.verify);
router.post('/settings/email/test', canManageEmail, validate(testEmailSchema), emailCtrl.sendTest);
router.get('/settings/email/logs', canManageEmail, emailCtrl.logs);
router.get('/settings/email/preview/:template', canManageEmail, emailCtrl.preview);

// Media library — image fields on content, sections and settings upload through here too.
// Anyone who can edit anything needs the picker, so media access follows any .edit permission.
const canUseMedia = (req, res, next) => (
  hasPermission(req.access, 'media.view', 'media.edit') || canEditSomething(req.access)
    ? next()
    : requirePermission('media.view')(req, res, next)
);
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
