import { LibraryDocument, DOCUMENT_CATEGORIES, CATEGORY_KEYS } from '../models/LibraryDocument.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';
import { safeFilename, DOCUMENT_LABEL, MAX_DOCUMENT_BYTES } from '../middleware/fileUpload.js';
import { libraryDocumentMetaSchema, libraryDocumentUpdateSchema } from '../validators/workspace.validators.js';

/**
 * The shared document library. Bytes live in Mongo — Render's disk does not
 * survive a deploy — and are only ever handed back by the download route, which
 * requires `documents.view`.
 */

export const options = asyncHandler(async (_req, res) =>
  ok(res, { categories: DOCUMENT_CATEGORIES, maxBytes: MAX_DOCUMENT_BYTES, accept: DOCUMENT_LABEL }));

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parseListQuery(req.query, { defaultSort: '-createdAt' });
  const filter = {};

  if (req.query.category && CATEGORY_KEYS.includes(req.query.category)) filter.category = req.query.category;
  if (req.query.search) {
    const rx = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { originalName: rx }];
  }

  const [items, total, categoryCounts] = await Promise.all([
    LibraryDocument.find(filter).select('-data').sort(sort).skip(skip).limit(limit),
    LibraryDocument.countDocuments(filter),
    LibraryDocument.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);

  const counts = CATEGORY_KEYS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
  categoryCounts.forEach(({ _id, count }) => { if (_id in counts) counts[_id] = count; });

  return ok(res, items, { ...buildMeta({ page, limit, total }), counts });
});

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file received');
  const meta = libraryDocumentMetaSchema.parse(req.body ?? {});

  const doc = await LibraryDocument.create({
    // Fall back to the file's own name so a hurried upload still reads sensibly.
    title: meta.title || req.file.originalname.replace(/\.[^.]+$/, '').slice(0, 200),
    description: meta.description || '',
    category: meta.category || 'general',
    filename: safeFilename(req.file.originalname),
    originalName: req.file.originalname.slice(0, 260),
    contentType: req.file.mimetype,
    size: req.file.size,
    data: req.file.buffer,
    uploadedBy: req.user?._id ?? null,
    uploadedByName: req.user?.name ?? '',
  });

  await recordAudit({ req, action: 'create', resource: 'documents', resourceId: doc.id, summary: `Uploaded "${doc.title}"` });

  const { data, ...rest } = doc.toJSON();
  return created(res, rest);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await LibraryDocument.findById(req.params.id).select('-data');
  if (!doc) throw ApiError.notFound('Document not found');

  Object.assign(doc, libraryDocumentUpdateSchema.parse(req.body ?? {}));
  await doc.save({ validateModifiedOnly: true });
  await recordAudit({ req, action: 'update', resource: 'documents', resourceId: doc.id, summary: `Updated "${doc.title}"` });
  return ok(res, doc);
});

export const download = asyncHandler(async (req, res) => {
  const doc = await LibraryDocument.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Document not found');

  // Best-effort counter; a failed increment must not fail the download.
  LibraryDocument.updateOne({ _id: doc._id }, { $inc: { downloads: 1 } }).catch(() => {});

  res.setHeader('Content-Type', doc.contentType);
  res.setHeader('Content-Length', doc.size);
  res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName.replace(/"/g, '')}"`);
  return res.send(doc.data);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await LibraryDocument.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Document not found');
  await recordAudit({ req, action: 'delete', resource: 'documents', resourceId: doc.id, summary: `Deleted "${doc.title}"` });
  return noContent(res);
});
