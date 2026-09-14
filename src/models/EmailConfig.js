import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

export const SMTP_SECURITY = ['starttls', 'ssl', 'none'];

/**
 * SMTP settings managed from the admin panel. A singleton, deliberately kept
 * out of SiteSetting: SiteSetting is served publicly to the website, and this
 * holds credentials. The password is stored sealed (utils/secretBox.js) and is
 * never serialised.
 */
const emailConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true, immutable: true },
    enabled: { type: Boolean, default: false },

    host: { type: String, default: '', trim: true },
    port: { type: Number, default: 587 },
    security: { type: String, enum: SMTP_SECURITY, default: 'starttls' },
    username: { type: String, default: '', trim: true },
    passwordSealed: { type: String, default: '', select: false, private: true },

    fromName: { type: String, default: '', trim: true },
    fromEmail: { type: String, default: '', trim: true, lowercase: true },
    replyTo: { type: String, default: '', trim: true, lowercase: true },

    // Comma-separated inboxes that receive every new-lead alert.
    adminRecipients: { type: String, default: '', trim: true },
    notifyAdmin: { type: Boolean, default: true },
    notifyStudent: { type: Boolean, default: true },

    lastTestAt: { type: Date },
    lastTestOk: { type: Boolean },
    lastError: { type: String, default: '' },
    updatedByName: { type: String, default: '' },
  },
  { timestamps: true },
);

emailConfigSchema.plugin(toJSONPlugin);

emailConfigSchema.statics.getSingleton = async function getSingleton({ withPassword = false } = {}) {
  const query = this.findOne({ key: 'default' });
  if (withPassword) query.select('+passwordSealed');
  const existing = await query;
  if (existing) return existing;
  await this.create({ key: 'default' });
  const created = this.findOne({ key: 'default' });
  if (withPassword) created.select('+passwordSealed');
  return created;
};

export const EmailConfig = mongoose.model('EmailConfig', emailConfigSchema);
