import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    hours: { type: String, trim: true, default: 'Mon–Sat · 10am–7pm' },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true, immutable: true },
    brand: { type: String, default: 'GIA Educare', trim: true },
    tagline: { type: String, default: 'Study · Apply · Fly', trim: true },
    logoUrl: { type: String, default: '/logo.jpg', trim: true },
    topbarMessage: { type: String, default: 'Free profile evaluation — limited slots for the Sept 2027 intake' },
    phonePrimary: { type: String, default: '+91 90000 00000' },
    phoneSecondary: { type: String, default: '+91 90000 00001' },
    emailPrimary: { type: String, default: 'hello@giaeducare.com' },
    emailAdmissions: { type: String, default: 'admissions@giaeducare.com' },
    hours: { type: String, default: 'Monday – Saturday, 10:00 am – 7:00 pm IST' },
    addressLine: { type: String, default: 'Orion Tower, Sector 44, Gurugram' },
    footerBlurb: {
      type: String,
      default:
        'Independent study-abroad counselling since 2016. Honest shortlists, capped caseloads, and one counsellor with you from evaluation to departure.',
    },
    offices: { type: [officeSchema], default: [] },
    socials: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    seo: {
      title: { type: String, default: 'GIA Educare – Study Abroad Consultants' },
      description: {
        type: String,
        default:
          'GIA Educare helps students get into top universities across 25+ countries – profile evaluation, university shortlisting, applications, visas and scholarships.',
      },
    },
    notifyEnquiriesTo: { type: String, default: '' },
  },
  { timestamps: true },
);

siteSettingSchema.plugin(toJSONPlugin);

// There is only ever one settings document.
siteSettingSchema.statics.getSingleton = async function getSingleton() {
  const existing = await this.findOne({ key: 'default' });
  if (existing) return existing;
  return this.create({ key: 'default' });
};

export const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
