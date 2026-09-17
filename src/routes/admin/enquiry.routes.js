import { Router } from 'express';
import * as ctrl from '../../controllers/enquiry.controller.js';
import { validate } from '../../middleware/validate.js';
import { requirePermission } from '../../middleware/auth.js';
import { idParamSchema, listQuerySchema } from '../../validators/common.validators.js';
import { updateEnquirySchema, addNoteSchema, manualLeadSchema, importLeadsSchema } from '../../validators/enquiry.validators.js';

const router = Router();

// Every handler below also narrows to the user's lead scope (all vs assigned).
router.get('/', requirePermission('leads.view'), validate(listQuerySchema, 'query'), ctrl.list);
router.post('/', requirePermission('leads.import'), validate(manualLeadSchema), ctrl.create);
router.post('/import', requirePermission('leads.import'), validate(importLeadsSchema), ctrl.importLeads);
router.get('/export', requirePermission('leads.export'), ctrl.exportCsv);
router.get('/assignees', requirePermission('leads.assign'), ctrl.assignees);
router.get('/:id', requirePermission('leads.view'), validate(idParamSchema, 'params'), ctrl.get);
// Status needs leads.edit, assignment needs leads.assign — the controller checks which fields were sent.
router.patch('/:id', requirePermission('leads.edit', 'leads.assign'), validate(idParamSchema, 'params'), validate(updateEnquirySchema), ctrl.update);
router.post('/:id/notes', requirePermission('leads.edit'), validate(idParamSchema, 'params'), validate(addNoteSchema), ctrl.addNote);
router.delete('/:id', requirePermission('leads.delete'), validate(idParamSchema, 'params'), ctrl.remove);

export default router;
