import { Router } from 'express';
import * as formatCtrl from '../../controllers/format.controller.js';
import * as libraryCtrl from '../../controllers/libraryDocument.controller.js';
import { validate } from '../../middleware/validate.js';
import { requirePermission } from '../../middleware/auth.js';
import { documentUpload } from '../../middleware/fileUpload.js';
import { idParamSchema, listQuerySchema } from '../../validators/common.validators.js';
import { messageFormatSchema, messageFormatUpdateSchema } from '../../validators/workspace.validators.js';

/**
 * The team workspace: the approved message formats, and the shared document
 * library. Neither is a registry resource — registry collections are served
 * publicly by /public/:resource, and both of these are internal to staff.
 */

const router = Router();

// ---- Important formats -----------------------------------------------------
const canViewFormats = requirePermission('formats.view', 'formats.edit');
const canEditFormats = requirePermission('formats.edit');

router.get('/formats/options', canViewFormats, formatCtrl.options);
router.get('/formats', canViewFormats, validate(listQuerySchema, 'query'), formatCtrl.list);
router.post('/formats', canEditFormats, validate(messageFormatSchema), formatCtrl.create);
router.get('/formats/:id', canViewFormats, validate(idParamSchema, 'params'), formatCtrl.get);
router.patch('/formats/:id', canEditFormats, validate(idParamSchema, 'params'), validate(messageFormatUpdateSchema), formatCtrl.update);
router.delete('/formats/:id', requirePermission('formats.delete'), validate(idParamSchema, 'params'), formatCtrl.remove);

// ---- Important documents ---------------------------------------------------
// Uploading is super-admin only until `documents.edit` is ticked for a role.
const canViewDocuments = requirePermission('documents.view', 'documents.edit');
const canEditDocuments = requirePermission('documents.edit');

router.get('/documents/options', canViewDocuments, libraryCtrl.options);
router.get('/documents', canViewDocuments, validate(listQuerySchema, 'query'), libraryCtrl.list);
// Multipart: the metadata arrives as form fields and is parsed in the controller.
router.post('/documents', canEditDocuments, documentUpload, libraryCtrl.upload);
router.get('/documents/:id/download', canViewDocuments, validate(idParamSchema, 'params'), libraryCtrl.download);
router.patch('/documents/:id', canEditDocuments, validate(idParamSchema, 'params'), libraryCtrl.update);
router.delete('/documents/:id', requirePermission('documents.delete'), validate(idParamSchema, 'params'), libraryCtrl.remove);

export default router;
