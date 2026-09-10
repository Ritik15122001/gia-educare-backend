import { Section } from '../models/Section.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { recordAudit } from '../models/AuditLog.js';

export const list = asyncHandler(async (_req, res) => ok(res, await Section.find().sort('key')));

export const get = asyncHandler(async (req, res) => {
  const doc = await Section.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Section not found');
  return ok(res, doc);
});

export const create = asyncHandler(async (req, res) => {
  const doc = await Section.create(req.body);
  await recordAudit({ req, action: 'create', resource: 'sections', resourceId: doc.id, summary: `Created section ${doc.key}` });
  return created(res, doc);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) throw ApiError.notFound('Section not found');
  await recordAudit({ req, action: 'update', resource: 'sections', resourceId: doc.id, summary: `Updated section ${doc.key}` });
  return ok(res, doc);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await Section.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Section not found');
  return noContent(res);
});
