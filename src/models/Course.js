import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

// Repeatable label/value rows used by the curriculum, fee breakdown and FAQs.
const pairSchema = new mongoose.Schema(
  { label: { type: String, required: true, trim: true }, value: { type: String, required: true, trim: true } },
  { _id: false },
);

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

    // ---- course detail page -------------------------------------------------
    // All optional: the detail page only renders the blocks that are filled in,
    // so existing courses keep working with nothing but a description.
    imageUrl: { type: String, default: '', trim: true },
    overview: { type: String, default: '', trim: true, maxlength: 4000 },
    highlights: { type: [String], default: [] },
    curriculum: { type: [pairSchema], default: [] },
    eligibility: { type: [String], default: [] },
    careerOutcomes: { type: [String], default: [] },
    universities: { type: [String], default: [] },
    feeBreakdown: { type: [pairSchema], default: [] },
    faqs: { type: [pairSchema], default: [] },
  },
  { timestamps: true },
);

courseSchema.plugin(toJSONPlugin);
courseSchema.plugin(contentPlugin);
courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model('Course', courseSchema);
