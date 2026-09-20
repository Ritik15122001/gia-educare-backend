import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

// 'not_connected' = we tried to reach them and could not get through.
export const ENQUIRY_STATUSES = ['new', 'contacted', 'not_connected', 'qualified', 'converted', 'closed'];

// Total budget for the whole program, in INR. Shared with the validator and
// mirrored by the website's form options — keep all three identical.
export const BUDGET_RANGES = ['Up to ₹10 Lakh', '₹10 – 20 Lakh', '₹20 – 30 Lakh', '₹30 – 50 Lakh', 'Above ₹50 Lakh'];

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
    budget: { type: String, enum: [...BUDGET_RANGES, ''], default: '', index: true },
    message: { type: String, default: '', trim: true, maxlength: 2000 },
    consent: { type: Boolean, required: true },

    // Referral attribution: a code/name the student typed or that arrived on a
    // ?ref= link, plus the campaign parameters of the visit that converted.
    referral: { type: String, default: '', trim: true, maxlength: 120, index: true },
    utmSource: { type: String, default: '', trim: true, maxlength: 120 },
    utmMedium: { type: String, default: '', trim: true, maxlength: 120 },
    utmCampaign: { type: String, default: '', trim: true, maxlength: 120 },
    referrerUrl: { type: String, default: '', trim: true, maxlength: 500 },
    landingPage: { type: String, default: '', trim: true, maxlength: 300 },

    status: { type: String, enum: ENQUIRY_STATUSES, default: 'new', index: true },
    // Assignment: a role (all its members see the lead) plus, optionally, one member of it.
    assignedRole: { type: String, default: '', trim: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedAt: { type: Date, default: null },
    notes: { type: [noteSchema], default: [] },

    // When the counsellor plans to call back. Drives the "today" and
    // "missed" follow-up queues; null means nothing is scheduled.
    followUpAt: { type: Date, default: null, index: true },

    // Set when a counsellor adds or imports the lead rather than the student
    // submitting the website form.
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

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
