import { Router } from 'express';
import * as publicCtrl from '../controllers/public.controller.js';
import * as enquiryCtrl from '../controllers/enquiry.controller.js';
import { validate } from '../middleware/validate.js';
import { enquiryLimiter } from '../middleware/rateLimit.js';
import { createEnquirySchema } from '../validators/enquiry.validators.js';

const router = Router();

router.get('/content', publicCtrl.getContent);
router.get('/settings', publicCtrl.getSettings);
router.post('/enquiries', enquiryLimiter, validate(createEnquirySchema), enquiryCtrl.submit);
router.get('/:resource', publicCtrl.listResource);

export default router;
