import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const factSchema = new mongoose.Schema(
  { label: { type: String, required: true, trim: true }, value: { type: String, required: true, trim: true } },
  { _id: false },
);

const destinationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: [true, 'Country name is required'], trim: true },
    flag: { type: String, default: '🌍', trim: true },
    tag: { type: String, trim: true, default: '' },
    bg: { type: String, default: 'linear-gradient(155deg,#2C4A7C,#0C1E3B)', trim: true },
    imageUrl: { type: String, default: '', trim: true },
    blurb: { type: String, default: '', trim: true, maxlength: 400 },
    description: { type: String, default: '', trim: true, maxlength: 1200 },
    meta: { type: [String], default: [] },
    facts: { type: [factSchema], default: [] },
    tags: { type: [String], default: [] },
    showOnHome: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

destinationSchema.plugin(toJSONPlugin);
destinationSchema.plugin(contentPlugin);
destinationSchema.index({ name: 'text', description: 'text', blurb: 'text' });

export const Destination = mongoose.model('Destination', destinationSchema);
