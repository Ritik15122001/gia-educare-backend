import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

/**
 * "Important formats" — the approved wording the team reuses: the WhatsApp
 * reply to a new lead, the follow-up email, the call opening. Admins write them
 * once here and everyone else copies them into their own client.
 *
 * Deliberately *not* a registry resource: registry collections are served
 * publicly by /public/:resource, and these are internal notes for staff. Same
 * reasoning as FinanceEntry.
 */

export const FORMAT_CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', hint: 'Short, no subject line. Sent from the counsellor’s own phone.' },
  { key: 'email', label: 'Email', hint: 'Give it a subject line — it is what the student sees first.' },
  { key: 'sms', label: 'SMS', hint: 'Keep it under 160 characters so it goes as one message.' },
  { key: 'call', label: 'Call script', hint: 'What to say and in what order — not read out word for word.' },
  { key: 'other', label: 'Other', hint: 'Anything else worth writing down once.' },
];

export const CHANNEL_KEYS = FORMAT_CHANNELS.map((c) => c.key);

/**
 * Tokens a format may contain. The preview swaps in `sample`, and the person
 * sending the message replaces them for real. Substitution is plain text
 * replacement — there is no template engine here on purpose.
 */
export const FORMAT_PLACEHOLDERS = [
  { token: '{{name}}', label: 'Student name', sample: 'Ananya Sharma' },
  { token: '{{first_name}}', label: 'First name', sample: 'Ananya' },
  { token: '{{counsellor}}', label: 'Counsellor name', sample: 'Priya Nair' },
  { token: '{{destination}}', label: 'Destination', sample: 'United Kingdom' },
  { token: '{{course}}', label: 'Course or level', sample: 'MSc Data Science' },
  { token: '{{intake}}', label: 'Intake', sample: 'September 2027' },
  { token: '{{budget}}', label: 'Budget', sample: '₹20 – 30 Lakh' },
  { token: '{{followup_date}}', label: 'Next follow-up date', sample: 'Monday, 28 September' },
  { token: '{{phone}}', label: 'Office phone', sample: '+91 99534 14741' },
  { token: '{{email}}', label: 'Office email', sample: 'info@giaeducare.com' },
  { token: '{{brand}}', label: 'Brand name', sample: 'GIA Educare' },
];

const messageFormatSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 160 },
    channel: { type: String, enum: CHANNEL_KEYS, default: 'whatsapp', index: true },
    // Only an email format uses this; the form hides it for the others.
    subject: { type: String, default: '', trim: true, maxlength: 240 },
    body: { type: String, required: [true, 'Write the message'], trim: true, maxlength: 8000 },
    // When to reach for this one, shown under the title in the list.
    description: { type: String, default: '', trim: true, maxlength: 400 },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    // Off means "kept for reference, do not send" — still visible to admins.
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdByName: { type: String, default: '', trim: true },
    updatedByName: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

messageFormatSchema.plugin(toJSONPlugin);
messageFormatSchema.index({ channel: 1, order: 1, createdAt: -1 });

export const MessageFormat = mongoose.model('MessageFormat', messageFormatSchema);
