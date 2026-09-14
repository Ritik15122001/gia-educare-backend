import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const factSchema = new mongoose.Schema(
  { label: { type: String, required: true, trim: true }, value: { type: String, required: true, trim: true } },
  { _id: false },
);

// Entrance and English-proficiency tests (IELTS, GRE, …). Drives the website's
// "Exams" menu, the /exams overview with "find colleges by exam", and one page
// per exam. Posts link to an exam by `slug`, the way they link to a destination.
const examSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: [true, 'Exam name is required'], trim: true },
    fullName: { type: String, default: '', trim: true },
    kind: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true, maxlength: 300 },
    description: { type: String, default: '', trim: true, maxlength: 1500 },
    // Indicative score most programs ask for — shown in "find colleges by exam".
    typicalScore: { type: String, default: '', trim: true },
    usedFor: { type: String, default: '', trim: true },
    // Destination names, matched to destination pages on the website.
    acceptedIn: { type: [String], default: [] },
    facts: { type: [factSchema], default: [] },
    officialUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

examSchema.plugin(toJSONPlugin);
examSchema.plugin(contentPlugin);

export const Exam = mongoose.model('Exam', examSchema);
