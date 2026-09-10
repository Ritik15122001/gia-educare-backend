import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const milestoneSchema = new mongoose.Schema(
  {
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

milestoneSchema.plugin(toJSONPlugin);
milestoneSchema.plugin(contentPlugin);

export const Milestone = mongoose.model('Milestone', milestoneSchema);
