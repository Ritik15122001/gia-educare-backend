import { z } from 'zod';
import { ENTRY_TYPES, PL_TAG_KEYS, PAYMENT_MODES, tagsForType } from '../models/FinanceEntry.js';

const day = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a YYYY-MM-DD date')
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'Enter a real date');

const fields = {
  type: z.enum(ENTRY_TYPES, { error: 'Choose income or expense' }),
  date: day,
  amount: z.coerce.number({ error: 'Enter an amount' })
    .positive('Amount must be more than zero')
    .max(1e11, 'That amount is too large')
    .transform((v) => Math.round(v * 100) / 100),
  category: z.string().trim().min(1, 'Choose or type a category').max(80),
  plTag: z.enum(PL_TAG_KEYS, { error: 'Choose a P&L tag' }),
  description: z.string().trim().max(500),
  party: z.string().trim().max(120),
  paymentMode: z.enum([...PAYMENT_MODES, '']),
  reference: z.string().trim().max(80),
};

// An income can't be tagged as an expense head, and vice versa.
const tagMatchesType = (v) => !v.type || !v.plTag || tagsForType(v.type).includes(v.plTag);
const tagError = { message: 'That P&L tag does not fit this entry type', path: ['plTag'] };

export const financeEntrySchema = z.object({
  ...fields,
  description: fields.description.optional().default(''),
  party: fields.party.optional().default(''),
  paymentMode: fields.paymentMode.optional().default(''),
  reference: fields.reference.optional().default(''),
}).refine(tagMatchesType, tagError);

// Default-free so a one-field PATCH never resets the others (zod 4 .partial() keeps defaults).
export const financeEntryUpdateSchema = z.object(
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.optional()])),
);

export const financeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(['date', '-date', 'amount', '-amount']).optional(),
  search: z.string().max(120).optional(),
  type: z.enum(ENTRY_TYPES).optional().or(z.literal('')),
  plTag: z.enum(PL_TAG_KEYS).optional().or(z.literal('')),
  category: z.string().max(80).optional(),
  from: day.optional().or(z.literal('')),
  to: day.optional().or(z.literal('')),
});
