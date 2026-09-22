import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

/**
 * Document uploads — lead attachments and the shared document library.
 *
 * Unlike the media library these are not images and are never served publicly,
 * so they are held in memory here and written straight into Mongo by the
 * controller. Render's disk is ephemeral; a document that vanishes on the next
 * deploy is worse than no document at all.
 */

export const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const DOCUMENT_LABEL = 'PDF, Word, Excel, PowerPoint, CSV, text, ZIP or an image';
export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;

export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_BYTES },
  fileFilter: (_req, file, cb) =>
    DOCUMENT_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(ApiError.badRequest(`Unsupported file type. Upload a ${DOCUMENT_LABEL}.`)),
}).single('file');

// A predictable, safe name to show and to download as.
export const safeFilename = (originalname = 'file') => {
  const dot = originalname.lastIndexOf('.');
  const ext = dot > 0 ? originalname.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, '') : '';
  const base = (dot > 0 ? originalname.slice(0, dot) : originalname)
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return `${base || 'file'}-${Date.now()}${ext}`;
};
