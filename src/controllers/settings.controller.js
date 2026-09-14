import { SiteSetting } from '../models/SiteSetting.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { recordAudit } from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { emailStatus, sendEmail, testEmail } from '../services/email.service.js';

export const get = asyncHandler(async (_req, res) => ok(res, await SiteSetting.getSingleton()));

export const update = asyncHandler(async (req, res) => {
  const settings = await SiteSetting.getSingleton();
  Object.assign(settings, req.body);
  await settings.save();
  await recordAudit({ req, action: 'update', resource: 'settings', summary: 'Updated site settings' });
  return ok(res, settings);
});

// Whether SMTP is configured, so the settings screen can say so plainly.
export const getEmailStatus = asyncHandler(async (_req, res) => ok(res, emailStatus()));

// Sends synchronously (unlike lead alerts) so the admin sees the real SMTP error.
export const sendTestEmail = asyncHandler(async (req, res) => {
  const status = emailStatus();
  if (!status.enabled) {
    throw ApiError.badRequest('Email is not configured on the server yet — set SMTP_HOST, SMTP_USER and SMTP_PASS.');
  }
  const settings = await SiteSetting.getSingleton();
  try {
    await sendEmail(testEmail(req.body.to, settings.brand), { throwOnError: true });
  } catch (err) {
    throw ApiError.badRequest(`The mail server rejected the message: ${err.message}`);
  }
  return ok(res, { message: `Test email sent to ${req.body.to}` });
});
