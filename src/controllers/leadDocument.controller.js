import { Enquiry } from '../models/Enquiry.js';
import { LeadDocument } from '../models/LeadDocument.js';
import { scoped } from './enquiry.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { recordAudit } from '../models/AuditLog.js';
import { safeFilename, DOCUMENT_LABEL, MAX_DOCUMENT_BYTES } from '../middleware/fileUpload.js';
import { leadDocumentMetaSchema } from '../validators/workspace.validators.js';

// Every handler starts here: an out-of-scope lead is a 404, exactly as it is
// on the enquiry routes, so the attachment list cannot leak its existence.
async function leadOrThrow(req) {
  const lead = await Enquiry.findOne(scoped(req, { _id: req.params.id })).select('_id name email');
  if (!lead) throw ApiError.notFound('Enquiry not found');
  return lead;
}

export const list = asyncHandler(async (req, res) => {
  const lead = await leadOrThrow(req);
  // `data` is marked private so it never serialises, but excluding it here
  // keeps the documents themselves out of memory.
  const docs = await LeadDocument.find({ enquiry: lead._id }).select('-data').sort('-createdAt');
  return ok(res, docs, { total: docs.length, maxBytes: MAX_DOCUMENT_BYTES, accept: DOCUMENT_LABEL });
});

export const upload = asyncHandler(async (req, res) => {
  const lead = await leadOrThrow(req);
  if (!req.file) throw ApiError.badRequest('No file received');

  const { label = '' } = leadDocumentMetaSchema.parse(req.body ?? {});

  const doc = await LeadDocument.create({
    enquiry: lead._id,
    label,
    filename: safeFilename(req.file.originalname),
    originalName: req.file.originalname.slice(0, 260),
    contentType: req.file.mimetype,
    size: req.file.size,
    data: req.file.buffer,
    uploadedBy: req.user?._id ?? null,
    uploadedByName: req.user?.name ?? '',
  });

  await recordAudit({
    req,
    action: 'create',
    resource: 'enquiries',
    resourceId: String(lead._id),
    summary: `Attached ${doc.originalName} to ${lead.email}`,
  });

  const { data, ...rest } = doc.toJSON();
  return created(res, rest);
});

export const download = asyncHandler(async (req, res) => {
  const lead = await leadOrThrow(req);
  const doc = await LeadDocument.findOne({ _id: req.params.docId, enquiry: lead._id });
  if (!doc) throw ApiError.notFound('Document not found');

  res.setHeader('Content-Type', doc.contentType);
  res.setHeader('Content-Length', doc.size);
  // The original name, quoted — it can contain spaces and commas.
  res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName.replace(/"/g, '')}"`);
  return res.send(doc.data);
});

export const remove = asyncHandler(async (req, res) => {
  const lead = await leadOrThrow(req);
  const doc = await LeadDocument.findOneAndDelete({ _id: req.params.docId, enquiry: lead._id });
  if (!doc) throw ApiError.notFound('Document not found');

  await recordAudit({
    req,
    action: 'delete',
    resource: 'enquiries',
    resourceId: String(lead._id),
    summary: `Removed ${doc.originalName} from ${lead.email}`,
  });
  return noContent(res);
});
