import { z } from 'zod';
import { ENQUIRY_STATUSES } from '../models/Enquiry.js';
import { objectId } from './common.validators.js';

export const createEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Enter a valid email address'),
  code: z.string().trim().max(6).default('+91'),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length >= 8 && v.length <= 15, 'Enter a valid phone number'),
  destination: z.string().trim().max(80).optional().default(''),
  level: z.string().trim().max(60).optional().default(''),
  intake: z.string().trim().max(60).optional().default(''),
  test: z.string().trim().max(60).optional().default(''),
  qual: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  sourcePage: z.string().trim().max(200).optional().default(''),
  // Honeypot: real users never fill this in.
  company: z.string().optional(),
});

export const updateEnquirySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  assignedTo: objectId.nullable().optional(),
});

export const addNoteSchema = z.object({
  body: z.string().trim().min(1, 'Note cannot be empty').max(2000),
});
