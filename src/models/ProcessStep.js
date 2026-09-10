import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const processStepSchema = new mongoose.Schema(
  {
    num: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true, maxlength: 400 },
  },
  { timestamps: true },
);

processStepSchema.plugin(toJSONPlugin);
processStepSchema.plugin(contentPlugin);

export const ProcessStep = mongoose.model('ProcessStep', processStepSchema);
