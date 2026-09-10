import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: [true, 'Course title is required'], trim: true },
    category: { type: String, required: true, trim: true, index: true },
    icon: { type: String, default: '🎓', trim: true },
    badge: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true, maxlength: 800 },
    duration: { type: String, default: '', trim: true },
    level: { type: String, default: '', trim: true },
    tuition: { type: String, default: '', trim: true },
    topPicks: { type: String, default: '', trim: true },
    note: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

courseSchema.plugin(toJSONPlugin);
courseSchema.plugin(contentPlugin);
courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model('Course', courseSchema);
