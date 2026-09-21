import path from 'node:path';
import fs from 'node:fs/promises';
import multer from 'multer';
import { env } from '../config/env.js';
import { Upload } from '../models/Upload.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

const UPLOAD_DIR = path.resolve('uploads');
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40);
    cb(null, `${base || 'file'}-${Date.now()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(ApiError.badRequest('Only JPG, PNG, WebP, GIF or SVG images are allowed')),
}).single('file');

// Built from the incoming request first: PUBLIC_URL is easy to leave pointing
// at localhost, and every image URL is then dead for real visitors.
const baseUrl = (req) => {
  const host = req?.get?.('host');
  return host ? `${req.protocol}://${host}` : env.PUBLIC_URL;
};
const fileUrl = (req, filename) => `${baseUrl(req)}/uploads/${filename}`;

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file received');

  // Keep a copy in Mongo so the image survives the next deploy.
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, req.file.filename));
    await Upload.findOneAndUpdate(
      { filename: req.file.filename },
      { filename: req.file.filename, contentType: req.file.mimetype, size: req.file.size, data },
      { upsert: true },
    );
  } catch (err) {
    logger.error(`[upload] could not store ${req.file.filename} in the database: ${err.message}`);
  }

  return created(res, {
    filename: req.file.filename,
    url: fileUrl(req, req.file.filename),
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

/** Serves an image the disk no longer has — i.e. anything uploaded before a deploy. */
export const serveStored = asyncHandler(async (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const doc = await Upload.findOne({ filename });
  if (!doc) return next();
  // Re-warm the disk cache so express.static answers the next request.
  fs.writeFile(path.join(UPLOAD_DIR, filename), doc.data).catch(() => {});
  res.set('Content-Type', doc.contentType);
  res.set('Cache-Control', 'public, max-age=604800');
  return res.send(doc.data);
});

export const list = asyncHandler(async (req, res) => {
  const stored = await Upload.find().select('filename size createdAt').sort('-createdAt').lean();
  const seen = new Set(stored.map((f) => f.filename));
  const items = stored.map((f) => ({ filename: f.filename, url: fileUrl(req, f.filename), size: f.size, uploadedAt: f.createdAt }));

  // Anything on disk but not yet in the database (uploaded before this change).
  const files = await fs.readdir(UPLOAD_DIR).catch(() => []);
  for (const filename of files) {
    if (filename.startsWith('.') || seen.has(filename)) continue;
    const stat = await fs.stat(path.join(UPLOAD_DIR, filename)).catch(() => null);
    if (stat) items.push({ filename, url: fileUrl(req, filename), size: stat.size, uploadedAt: stat.mtime });
  }

  return ok(res, items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
});

export const remove = asyncHandler(async (req, res) => {
  const filename = path.basename(req.params.filename); // never escape the uploads dir
  const [, dbResult] = await Promise.all([
    fs.unlink(path.join(UPLOAD_DIR, filename)).catch(() => null),
    Upload.deleteOne({ filename }),
  ]);
  if (!dbResult.deletedCount) {
    const onDisk = await fs.stat(path.join(UPLOAD_DIR, filename)).catch(() => null);
    if (!onDisk) throw ApiError.notFound('File not found');
  }
  return ok(res, { message: 'Deleted' });
});
