import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const courseCategorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

courseCategorySchema.plugin(toJSONPlugin);
courseCategorySchema.plugin(contentPlugin);

export const CourseCategory = mongoose.model('CourseCategory', courseCategorySchema);
