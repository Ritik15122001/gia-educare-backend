import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

export const SERVICE_ICONS = [
  'target', 'search', 'document', 'shield-check', 'briefcase', 'coins',
  'cap', 'shield', 'clock', 'home', 'users', 'phone', 'mail', 'pin',
];

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '', trim: true, maxlength: 600 },
    icon: { type: String, enum: SERVICE_ICONS, default: 'target' },
  },
  { timestamps: true },
);

serviceSchema.plugin(toJSONPlugin);
serviceSchema.plugin(contentPlugin);

export const Service = mongoose.model('Service', serviceSchema);
