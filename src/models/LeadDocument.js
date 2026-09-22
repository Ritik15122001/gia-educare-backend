import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

/**
 * A file attached to one enquiry — a passport scan, a transcript, an offer
 * letter. The bytes live in Mongo (`private`, so they never serialise into a
 * response) and are streamed back by the download route, which re-checks the
 * caller's lead scope. Deleting the enquiry deletes its documents.
 */
const leadDocumentSchema = new mongoose.Schema(
  {
    enquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry', required: true, index: true },
    label: { type: String, default: '', trim: true, maxlength: 160 },
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true, maxlength: 260 },
    contentType: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, private: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    uploadedByName: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

leadDocumentSchema.plugin(toJSONPlugin);
leadDocumentSchema.index({ enquiry: 1, createdAt: -1 });

export const LeadDocument = mongoose.model('LeadDocument', leadDocumentSchema);
