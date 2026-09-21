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
    phonePrimary: { type: String, default: "+91 99534 14741" },
    phoneSecondary: { type: String, default: "+91 98106 49827" },
    emailPrimary: { type: String, default: "info@giaeducare.com" },
    emailAdmissions: { type: String, default: '' },
    hours: { type: String, default: 'Monday – Saturday, 10:00 am – 7:00 pm IST' },
    addressLine: { type: String, default: "307, Second Floor, G25, Sector 3, Noida 201301" },
    footerBlurb: {
      type: String,
      default:
        'Independent study-abroad counselling since 2016. Honest shortlists, capped caseloads, and one counsellor with you from evaluation to departure.',
    },
    offices: { type: [officeSchema], default: [] },
    socials: {
      facebook: { type: String, default: "https://www.facebook.com/giaeducare" },
      instagram: { type: String, default: "https://www.instagram.com/giaeducare" },
      linkedin: { type: String, default: "https://linkedin.com/in/giaeducare/" },
      youtube: { type: String, default: "https://www.youtube.com/@giaeducare" },
      whatsapp: { type: String, default: "https://wa.me/919953414741" },
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

    // Footer legal line and policy pages, and the office map on the contact page.
    legalEntity: { type: String, default: "A Study Abroad Unit of HolidayAlong Hospitality LLP", trim: true },
    // Relative by default — the website serves these three pages itself. An
    // absolute URL still works if a policy is hosted elsewhere.
    legalLinks: {
      privacy: { type: String, default: '/privacy-policy', trim: true },
      terms: { type: String, default: '/terms-of-service', trim: true },
      refund: { type: String, default: '/refund-policy', trim: true },
    },
    // A Google Maps link (e.g. https://maps.google.com/?q=lat,lng); the website
    // embeds it and links "Get directions" to it.
    mapUrl: { type: String, default: "https://maps.google.com/?q=28.580475,77.320351", trim: true },

    // "Founder connect" — a personal note plus every channel to reach them.
    founder: {
      enabled: { type: Boolean, default: true },
      name: { type: String, default: '', trim: true },
      title: { type: String, default: '', trim: true },
      photoUrl: { type: String, default: '', trim: true },
      message: { type: String, default: '', trim: true },
      email: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
      whatsapp: { type: String, default: '', trim: true },
      linkedin: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      youtube: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
      facebook: { type: String, default: '', trim: true },
    },
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
