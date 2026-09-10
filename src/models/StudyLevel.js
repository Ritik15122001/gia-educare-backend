import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const studyLevelSchema = new mongoose.Schema(
  {
    num: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

studyLevelSchema.plugin(toJSONPlugin);
studyLevelSchema.plugin(contentPlugin);

export const StudyLevel = mongoose.model('StudyLevel', studyLevelSchema);
