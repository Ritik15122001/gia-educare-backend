import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const statSchema = new mongoose.Schema(
  {
    value: { type: Number, required: [true, 'A numeric value is required'] },
    suffix: { type: String, default: '+', trim: true, maxlength: 4 },
    label: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

statSchema.plugin(toJSONPlugin);
statSchema.plugin(contentPlugin);

export const Stat = mongoose.model('Stat', statSchema);
