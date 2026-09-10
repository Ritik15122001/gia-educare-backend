import { Router } from 'express';
import * as ctrl from '../../controllers/enquiry.controller.js';
import { validate } from '../../middleware/validate.js';
import { requireRole } from '../../middleware/auth.js';
import { idParamSchema, listQuerySchema } from '../../validators/common.validators.js';
import { updateEnquirySchema, addNoteSchema } from '../../validators/enquiry.validators.js';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), ctrl.list);
router.get('/export', ctrl.exportCsv);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.get);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateEnquirySchema), ctrl.update);
router.post('/:id/notes', validate(idParamSchema, 'params'), validate(addNoteSchema), ctrl.addNote);
router.delete('/:id', requireRole('super_admin', 'admin'), validate(idParamSchema, 'params'), ctrl.remove);

export default router;
