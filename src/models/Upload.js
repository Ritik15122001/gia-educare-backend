import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

/**
 * Uploaded images live in Mongo as well as on disk. Render's filesystem is
 * wiped on every deploy, so the disk copy is only a cache — the database copy
 * is what keeps a hotel photo or a counsellor's headshot alive.
 */
const uploadSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true, trim: true },
    contentType: { type: String, required: true },
    size: { type: Number, default: 0 },
    data: { type: Buffer, required: true, private: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

uploadSchema.plugin(toJSONPlugin);

export const Upload = mongoose.model('Upload', uploadSchema);
