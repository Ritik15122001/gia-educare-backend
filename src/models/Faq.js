import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, 'Question is required'], trim: true },
    answer: { type: String, required: [true, 'Answer is required'], trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

faqSchema.plugin(toJSONPlugin);
faqSchema.plugin(contentPlugin);
faqSchema.index({ question: 'text', answer: 'text' });

export const Faq = mongoose.model('Faq', faqSchema);
