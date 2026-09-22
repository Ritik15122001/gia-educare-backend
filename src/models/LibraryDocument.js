import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

/**
 * The shared document library — brochures, checklists, agreements, rate cards:
 * the files the team needs at hand. Uploading is a super-admin job by default
 * (`documents.edit` is not granted to any other role until it is ticked in the
 * role editor); anyone with `documents.view` can download.
 *
 * As with lead attachments the bytes live in Mongo, because Render's disk does
 * not survive a deploy.
 */

export const DOCUMENT_CATEGORIES = [
  { key: 'general', label: 'General' },
  { key: 'brochure', label: 'Brochures & flyers' },
  { key: 'checklist', label: 'Checklists' },
  { key: 'agreement', label: 'Agreements & contracts' },
  { key: 'university', label: 'University material' },
  { key: 'visa', label: 'Visa & documentation' },
  { key: 'finance', label: 'Fees & finance' },
  { key: 'training', label: 'Training & process' },
];

export const CATEGORY_KEYS = DOCUMENT_CATEGORIES.map((c) => c.key);

const libraryDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    description: { type: String, default: '', trim: true, maxlength: 600 },
    category: { type: String, enum: CATEGORY_KEYS, default: 'general', index: true },
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true, maxlength: 260 },
    contentType: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, private: true },
    downloads: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    uploadedByName: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

libraryDocumentSchema.plugin(toJSONPlugin);
libraryDocumentSchema.index({ category: 1, createdAt: -1 });
libraryDocumentSchema.index({ title: 'text', description: 'text', originalName: 'text' });

export const LibraryDocument = mongoose.model('LibraryDocument', libraryDocumentSchema);
