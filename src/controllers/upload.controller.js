import path from 'node:path';
import fs from 'node:fs/promises';
import multer from 'multer';
import { env } from '../config/env.js';
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

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file received');
  return created(res, {
    filename: req.file.filename,
    url: `${env.PUBLIC_URL}/uploads/${req.file.filename}`,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

export const list = asyncHandler(async (_req, res) => {
  const files = await fs.readdir(UPLOAD_DIR).catch(() => []);
  const items = await Promise.all(
    files
      .filter((f) => !f.startsWith('.'))
      .map(async (filename) => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, filename));
        return { filename, url: `${env.PUBLIC_URL}/uploads/${filename}`, size: stat.size, uploadedAt: stat.mtime };
      }),
  );
  return ok(res, items.sort((a, b) => b.uploadedAt - a.uploadedAt));
});

export const remove = asyncHandler(async (req, res) => {
  const filename = path.basename(req.params.filename); // never escape the uploads dir
  await fs.unlink(path.join(UPLOAD_DIR, filename)).catch(() => {
    throw ApiError.notFound('File not found');
  });
  return ok(res, { message: 'Deleted' });
});
