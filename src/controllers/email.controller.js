import { EmailConfig } from '../models/EmailConfig.js';
import { EmailLog, EMAIL_TYPES } from '../models/EmailLog.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { recordAudit } from '../models/AuditLog.js';
import { seal, open } from '../utils/secretBox.js';
import {
  resolveEmailConfig,
  invalidateEmailConfig,
  verifySmtp,
  sendEmail,
  testEmail,
  enquiryAlertEmail,
  enquiryConfirmationEmail,
  accountCreatedEmail,
  SAMPLE_ENQUIRY, assignmentEmail,
} from '../services/email.service.js';

// The password never leaves the server — only whether one is saved and usable.
async function snapshot() {
  const config = await EmailConfig.getSingleton({ withPassword: true });
  const settings = await SiteSetting.getSingleton();
  const status = await resolveEmailConfig({ fresh: true });
  const hasPassword = Boolean(config.passwordSealed);
  return {
    ...config.toJSON(),
    hasPassword,
    passwordReadable: !hasPassword || open(config.passwordSealed) !== null,
    status: { source: status.source, sending: Boolean(status.smtp) && !status.problem, problem: status.problem },
    // What lead alerts fall back to when no recipients are set here.
    fallbackRecipients: settings.notifyEnquiriesTo || settings.emailAdmissions || settings.emailPrimary || '',
  };
}

export const get = asyncHandler(async (_req, res) => ok(res, await snapshot()));

export const update = asyncHandler(async (req, res) => {
  const { password, clearPassword, ...fields } = req.body;
  const config = await EmailConfig.getSingleton({ withPassword: true });

  Object.assign(config, fields);
  if (clearPassword) config.passwordSealed = '';
  else if (password) config.passwordSealed = seal(password);
  config.updatedByName = req.user?.name || '';

  if (config.enabled && !config.passwordSealed && config.username) {
    throw ApiError.badRequest('Enter the SMTP password before switching sending on.', [
      { field: 'password', message: 'Password is required' },
    ]);
  }

  await config.save();
  invalidateEmailConfig();
  await recordAudit({
    req,
    action: 'update',
    resource: 'settings',
    summary: `Updated email settings (${config.enabled ? `sending via ${config.host}` : 'sending off'})`,
  });
  return ok(res, await snapshot());
});

/** Tests the values on screen — saved or not — without sending anything. */
export const verify = asyncHandler(async (req, res) => {
  const saved = await EmailConfig.getSingleton({ withPassword: true });
  const { password, ...smtp } = req.body;
  const result = await verifySmtp({ ...smtp, password: password || open(saved.passwordSealed) || '' });

  saved.lastTestAt = new Date();
  saved.lastTestOk = result.ok;
  saved.lastError = result.ok ? '' : result.error;
  await saved.save();

  if (!result.ok) throw ApiError.badRequest(result.error);
  return ok(res, { message: `Connected to ${smtp.host}:${smtp.port} and signed in successfully.` });
});

/** Sends a real email with the saved settings. */
export const sendTest = asyncHandler(async (req, res) => {
  const settings = await SiteSetting.getSingleton();
  try {
    await sendEmail(testEmail(req.body.to, settings), { type: 'test', throwOnError: true });
  } catch (err) {
    throw ApiError.badRequest(err.message);
  }
  return ok(res, { message: `Test email sent to ${req.body.to}. Check the inbox (and spam folder).` });
});

export const logs = asyncHandler(async (req, res) => {
  const filter = {};
  if (EMAIL_TYPES.includes(req.query.type)) filter.type = req.query.type;
  if (['sent', 'failed', 'skipped'].includes(req.query.status)) filter.status = req.query.status;
  const items = await EmailLog.find(filter).sort('-createdAt').limit(50);
  const since = new Date(Date.now() - 30 * 86400000);
  const totals = await EmailLog.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
  return ok(res, items, { last30Days: Object.fromEntries(totals.map((t) => [t._id, t.count])) });
});

const PREVIEWS = {
  'admin-alert': (settings) => ({ ...enquiryAlertEmail(SAMPLE_ENQUIRY, settings), to: 'your team' }),
  'student-confirmation': (settings) => enquiryConfirmationEmail(SAMPLE_ENQUIRY, settings),
  'lead-assigned': (settings) => ({ ...assignmentEmail(SAMPLE_ENQUIRY, { name: 'Arjun Verma', email: 'arjun@example.com' }, settings), to: 'the counsellor' }),
  'account-created': (settings) => accountCreatedEmail({ name: 'Arjun Verma', email: 'arjun@example.com', roleName: 'Counsellor' }, 'GIA Admin', settings),
  test: (settings) => testEmail('you@example.com', settings),
};

export const preview = asyncHandler(async (req, res) => {
  const build = PREVIEWS[req.params.template];
  if (!build) throw ApiError.notFound('Unknown email template');
  const { subject, html, to } = build(await SiteSetting.getSingleton());
  return ok(res, { subject, html, to });
});
