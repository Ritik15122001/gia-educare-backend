import { z } from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const idParamSchema = z.object({ id: objectId });

export const reorderSchema = z.object({
  items: z
    .array(z.object({ id: objectId, order: z.number().int().min(0) }))
    .min(1, 'Nothing to reorder'),
});

// Shared tail on every content schema.
export const contentBase = {
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
};

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  published: z.enum(['true', 'false']).optional(),
  category: z.string().optional(),
  showOnHome: z.enum(['true', 'false']).optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
