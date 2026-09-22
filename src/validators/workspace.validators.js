import { z } from 'zod';
import { CHANNEL_KEYS } from '../models/MessageFormat.js';
import { CATEGORY_KEYS } from '../models/LibraryDocument.js';

// ---------------------------------------------------------------------------
// Message & email formats
// ---------------------------------------------------------------------------

export const messageFormatSchema = z.object({
  title: z.string().trim().min(2, 'Give the format a title').max(160),
  channel: z.enum(CHANNEL_KEYS).default('whatsapp'),
  subject: z.string().trim().max(240).optional().default(''),
  body: z.string().trim().min(1, 'Write the message').max(8000),
  description: z.string().trim().max(400).optional().default(''),
  tags: z.array(z.string().trim().max(40)).max(12).optional().default([]),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

// Built field by field rather than with .partial(): zod 4's .partial() still
// applies .default()s, so a one-field PATCH would reset the rest.
export const messageFormatUpdateSchema = z.object({
  title: z.string().trim().min(2, 'Give the format a title').max(160).optional(),
  channel: z.enum(CHANNEL_KEYS).optional(),
  subject: z.string().trim().max(240).optional(),
  body: z.string().trim().min(1, 'Write the message').max(8000).optional(),
  description: z.string().trim().max(400).optional(),
  tags: z.array(z.string().trim().max(40)).max(12).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Document library. The file itself arrives as multipart, so only the metadata
// is validated here — and on upload it comes in as form fields, i.e. strings.
// ---------------------------------------------------------------------------

export const libraryDocumentMetaSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(600).optional(),
  category: z.enum(CATEGORY_KEYS).optional(),
});

export const libraryDocumentUpdateSchema = z.object({
  title: z.string().trim().min(2, 'Give the document a title').max(200).optional(),
  description: z.string().trim().max(600).optional(),
  category: z.enum(CATEGORY_KEYS).optional(),
});

// A label for one lead attachment, also arriving as a multipart form field.
export const leadDocumentMetaSchema = z.object({
  label: z.string().trim().max(160).optional(),
});
