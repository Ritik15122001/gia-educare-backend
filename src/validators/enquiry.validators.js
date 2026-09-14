import { z } from 'zod';
import { ENQUIRY_STATUSES, BUDGET_RANGES } from '../models/Enquiry.js';
import { objectId } from './common.validators.js';

export const createEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Enter a valid email address'),
  code: z.string().trim().regex(/^\+\d{1,4}$/, 'Choose a valid country code').default('+91'),
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
  budget: z.enum(BUDGET_RANGES, { error: 'Please choose your budget range' }),
  message: z.string().trim().max(2000).optional().default(''),
  // zod 4 takes `error`; the v3 `errorMap` option is silently ignored.
  consent: z.literal(true, { error: 'Consent is required' }),
  sourcePage: z.string().trim().max(200).optional().default(''),
  referral: z.string().trim().max(120).optional().default(''),
  utmSource: z.string().trim().max(120).optional().default(''),
  utmMedium: z.string().trim().max(120).optional().default(''),
  utmCampaign: z.string().trim().max(120).optional().default(''),
  referrerUrl: z.string().trim().max(500).optional().default(''),
  landingPage: z.string().trim().max(300).optional().default(''),
  // Honeypot: real users never fill this in.
  company: z.string().optional(),
});

export const updateEnquirySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  // Assign to a role (every member sees the lead) and optionally one person in it.
  assignedRole: z.string().trim().max(60).optional(),
  assignedTo: objectId.nullable().optional(),
});

export const addNoteSchema = z.object({
  body: z.string().trim().min(1, 'Note cannot be empty').max(2000),
});
