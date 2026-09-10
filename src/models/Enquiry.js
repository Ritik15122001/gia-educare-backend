import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

export const ENQUIRY_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'];

const noteSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, 'Enter a valid email'],
      index: true,
    },
    code: { type: String, default: '+91', trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    destination: { type: String, default: '', trim: true, index: true },
    level: { type: String, default: '', trim: true },
    intake: { type: String, default: '', trim: true },
    test: { type: String, default: '', trim: true },
    qual: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true, maxlength: 2000 },
    consent: { type: Boolean, required: true },

    status: { type: String, enum: ENQUIRY_STATUSES, default: 'new', index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: [noteSchema], default: [] },

    // Where the lead came from, for attribution.
    source: { type: String, default: 'website', trim: true },
    sourcePage: { type: String, default: '', trim: true },
    ip: { type: String, default: '', trim: true, private: true },
    userAgent: { type: String, default: '', trim: true, private: true },
  },
  { timestamps: true },
);

enquirySchema.plugin(toJSONPlugin);
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ name: 'text', email: 'text', phone: 'text', message: 'text' });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
