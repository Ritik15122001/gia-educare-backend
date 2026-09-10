import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(120),
  email: z.string().email('Enter a valid email'),
});

export const userCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['super_admin', 'admin', 'editor']).default('editor'),
  active: z.boolean().default(true),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).optional(),
});
