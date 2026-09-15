import { Router } from 'express';
import * as ctrl from '../../controllers/finance.controller.js';
import { validate } from '../../middleware/validate.js';
import { requirePermission } from '../../middleware/auth.js';
import { idParamSchema } from '../../validators/common.validators.js';
import { financeEntrySchema, financeEntryUpdateSchema, financeQuerySchema } from '../../validators/finance.validators.js';

const router = Router();

const canView = requirePermission('finance.view', 'finance.edit');
const canEdit = requirePermission('finance.edit');

router.get('/options', canView, ctrl.options);
router.get('/summary', canView, validate(financeQuerySchema, 'query'), ctrl.summary);
router.get('/export', canView, validate(financeQuerySchema, 'query'), ctrl.exportCsv);
router.get('/entries', canView, validate(financeQuerySchema, 'query'), ctrl.list);
router.post('/entries', canEdit, validate(financeEntrySchema), ctrl.create);
router.get('/entries/:id', canView, validate(idParamSchema, 'params'), ctrl.get);
router.patch('/entries/:id', canEdit, validate(idParamSchema, 'params'), validate(financeEntryUpdateSchema), ctrl.update);
router.delete('/entries/:id', requirePermission('finance.delete'), validate(idParamSchema, 'params'), ctrl.remove);

export default router;
