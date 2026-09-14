import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';
import { PERMISSIONS, LEAD_SCOPES } from '../lib/permissions.js';

// A named bundle of permissions. Users reference a role by its `key`, which is
// fixed at creation so renaming a role never orphans its members or leads.
const roleSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9_-]+$/ },
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 60 },
    description: { type: String, default: '', trim: true, maxlength: 240 },
    permissions: { type: [{ type: String, enum: PERMISSIONS }], default: [] },
    leadScope: { type: String, enum: LEAD_SCOPES, default: 'assigned' },
    // System roles can be edited (except super admin) but never deleted.
    system: { type: Boolean, default: false },
  },
  { timestamps: true },
);

roleSchema.plugin(toJSONPlugin);

export const Role = mongoose.model('Role', roleSchema);
