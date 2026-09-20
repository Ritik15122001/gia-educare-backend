import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

export const NOTIFICATION_TYPES = ['lead.new', 'lead.assigned', 'lead.remark', 'followup.due'];

/**
 * One row per recipient, so "read" is per person and the feed can be queried
 * by user without fanning out at read time. Rows expire after 90 days.
 */
const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, default: '', trim: true, maxlength: 500 },
    // Admin-relative path, e.g. /enquiries/<id>.
    link: { type: String, default: '', trim: true, maxlength: 300 },
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.plugin(toJSONPlugin);
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const Notification = mongoose.model('Notification', notificationSchema);
