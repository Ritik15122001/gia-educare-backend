import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

export const EMAIL_TYPES = ['lead-admin-alert', 'lead-student-confirmation', 'account-created', 'test'];

// One row per send attempt, so the admin can see what went out and why
// something didn't. Rows expire after 90 days.
const emailLogSchema = new mongoose.Schema(
  {
    type: { type: String, enum: EMAIL_TYPES, required: true, index: true },
    to: { type: [String], default: [] },
    subject: { type: String, default: '', trim: true },
    status: { type: String, enum: ['sent', 'failed', 'skipped'], required: true, index: true },
    error: { type: String, default: '' },
    messageId: { type: String, default: '' },
    enquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry', default: null },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 },
  },
  { versionKey: false },
);

emailLogSchema.plugin(toJSONPlugin);
// The TTL index on createdAt also serves newest-first sorting.

export const EmailLog = mongoose.model('EmailLog', emailLogSchema);
