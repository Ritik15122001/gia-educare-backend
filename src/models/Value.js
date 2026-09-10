import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';
import { SERVICE_ICONS } from './Service.js';

const valueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    icon: { type: String, enum: SERVICE_ICONS, default: 'shield' },
  },
  { timestamps: true },
);

valueSchema.plugin(toJSONPlugin);
valueSchema.plugin(contentPlugin);

export const Value = mongoose.model('Value', valueSchema);
