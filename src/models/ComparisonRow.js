import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const comparisonRowSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, trim: true },
    length: { type: String, default: '', trim: true },
    tuition: { type: String, default: '', trim: true },
    living: { type: String, default: '', trim: true },
    work: { type: String, default: '', trim: true },
    best: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

comparisonRowSchema.plugin(toJSONPlugin);
comparisonRowSchema.plugin(contentPlugin);

export const ComparisonRow = mongoose.model('ComparisonRow', comparisonRowSchema);
