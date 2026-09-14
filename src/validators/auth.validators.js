import { z } from 'zod';
import { PERMISSIONS, LEAD_SCOPES } from '../lib/permissions.js';

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

// zod 4's .partial() still fills in .default()s, so update schemas are built
// from default-free fields — otherwise a PATCH of one field resets the others.
const userFields = {
  name: z.string().min(2).max(120),
  email: z.string().email(),
  // A Role key; the controller checks it exists.
  role: z.string().trim().min(1, 'Choose a role').max(60),
  active: z.boolean(),
};

export const userCreateSchema = z.object({
  ...userFields,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: userFields.role.default('editor'),
  active: userFields.active.default(true),
});

export const userUpdateSchema = z.object({ ...userFields, password: z.string().min(8) }).partial();

const roleFields = {
  name: z.string().trim().min(2, 'Name is too short').max(60),
  description: z.string().trim().max(240),
  permissions: z.array(z.enum(PERMISSIONS)),
  leadScope: z.enum(LEAD_SCOPES),
};

export const roleSchema = z.object({
  ...roleFields,
  description: roleFields.description.default(''),
  permissions: roleFields.permissions.default([]),
  leadScope: roleFields.leadScope.default('assigned'),
});

export const roleUpdateSchema = z.object(roleFields).partial();
