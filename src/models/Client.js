import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

// Universities and schools GIA Educare has worked with — the logo wall on the
// home page. A row with no logo renders as a text wordmark on the website.
const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Institution name is required'], trim: true },
    logoUrl: { type: String, default: '', trim: true },
    websiteUrl: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

clientSchema.plugin(toJSONPlugin);
clientSchema.plugin(contentPlugin);

export const Client = mongoose.model('Client', clientSchema);
