import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

// Editable copy for each section of the marketing site, addressed by a stable
// key such as `home.services`. The frontend falls back to its built-in copy if
// a key is missing, so adding a key here is always optional.
const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    label: { type: String, required: true, trim: true },
    eyebrow: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    lead: { type: String, default: '', trim: true, maxlength: 1200 },
    ctaLabel: { type: String, default: '', trim: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

sectionSchema.plugin(toJSONPlugin);

export const Section = mongoose.model('Section', sectionSchema);
