import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Outgoing email. Everything here is best-effort: a notification must never
 * fail the request that triggered it, so callers use `queueEmail()` and move on.
 *
 * With no SMTP_HOST configured, messages are logged instead of sent — local
 * development and the seed never need credentials.
 */

let transporter = null;

function getTransporter() {
  if (!env.emailEnabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.smtpSecure,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export const emailStatus = () => ({
  enabled: env.emailEnabled,
  host: env.SMTP_HOST || null,
  from: env.EMAIL_FROM,
});

// Every value that reaches an email body is user-controlled somewhere upstream.
const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const splitRecipients = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Sends one message. Resolves to { sent | skipped }, throws only when asked to. */
export async function sendEmail({ to, subject, html, text, replyTo }, { throwOnError = false } = {}) {
  const recipients = Array.isArray(to) ? to : splitRecipients(to);
  if (!recipients.length) return { skipped: 'no recipients' };

  const transport = getTransporter();
  if (!transport) {
    logger.info(`[email:log-only] to=${recipients.join(', ')} subject="${subject}"`);
    return { skipped: 'smtp not configured' };
  }

  try {
    const info = await transport.sendMail({ from: env.EMAIL_FROM, to: recipients, subject, html, text, replyTo });
    logger.info(`[email] sent "${subject}" → ${recipients.join(', ')} (${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`[email] failed "${subject}" → ${recipients.join(', ')}: ${err.message}`);
    if (throwOnError) throw err;
    return { skipped: err.message };
  }
}

// Fire-and-forget — the HTTP response has already gone out.
export function queueEmail(message) {
  setImmediate(() => {
    sendEmail(message).catch(() => {});
  });
}

// --- layout ---------------------------------------------------------------

function layout({ brand, preheader, heading, bodyHtml }) {
  return `<!doctype html><html><body style="margin:0;background:#FAF7F0;font-family:Arial,Helvetica,sans-serif;color:#12203A">
<span style="display:none;opacity:0;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #E7E2D7;border-radius:14px;overflow:hidden">
<tr><td style="background:#08192F;padding:20px 28px;color:#fff;font-size:18px;font-weight:bold">${esc(brand)}
<span style="display:block;color:#C9A44D;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px">Study · Apply · Fly</span></td></tr>
<tr><td style="padding:28px">
<h1 style="font-size:20px;margin:0 0 14px;color:#08192F">${esc(heading)}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;background:#FAF7F0;color:#5C6B84;font-size:12px">${esc(brand)} · This is an automated message.</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href, label, bg = '#C9A44D', fg = '#08192F') =>
  `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${fg};text-decoration:none;font-weight:bold;font-size:14px;padding:11px 18px;border-radius:8px;margin:4px 6px 4px 0">${esc(label)}</a>`;

const rows = (pairs) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:6px 0 18px">${pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #EFEDE6;color:#5C6B84;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #EFEDE6;font-weight:bold;vertical-align:top">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`;

const digits = (v) => String(v || '').replace(/\D/g, '');

// --- messages -------------------------------------------------------------

/** New lead → the team inbox. */
export function enquiryAlertEmail(enquiry, settings) {
  const brand = settings?.brand || 'GIA Educare';
  const to = settings?.notifyEnquiriesTo || settings?.emailAdmissions || settings?.emailPrimary;
  const phone = `${enquiry.code || ''} ${enquiry.phone || ''}`.trim();
  const subject = `New enquiry: ${enquiry.name}${enquiry.destination ? ` → ${enquiry.destination}` : ''}${enquiry.budget ? ` (${enquiry.budget})` : ''}`;

  const bodyHtml = `<p style="margin:0 0 6px;font-size:14px;color:#5C6B84">A new lead just came in from the website.</p>
${rows([
  ['Name', enquiry.name],
  ['Email', enquiry.email],
  ['Phone', phone],
  ['Destination', enquiry.destination],
  ['Budget', enquiry.budget],
  ['Study level', enquiry.level],
  ['Intake', enquiry.intake],
  ['Test status', enquiry.test],
  ['Qualification', enquiry.qual],
  ['Referral', enquiry.referral],
  ['Campaign', [enquiry.utmSource, enquiry.utmMedium, enquiry.utmCampaign].filter(Boolean).join(' / ')],
  ['Came from', enquiry.sourcePage],
  ['Message', enquiry.message],
])}
${button(`${env.ADMIN_URL}/enquiries/${enquiry.id}`, 'Open in admin')}
${button(`tel:${enquiry.code || ''}${digits(enquiry.phone)}`, 'Call', '#08192F', '#ffffff')}
${button(`https://wa.me/${digits(`${enquiry.code || ''}${enquiry.phone || ''}`)}`, 'WhatsApp', '#1FA855', '#ffffff')}`;

  const text = [
    subject,
    '',
    `Email: ${enquiry.email}`,
    `Phone: ${phone}`,
    `Budget: ${enquiry.budget || '-'}`,
    `Referral: ${enquiry.referral || '-'}`,
    `Message: ${enquiry.message || '-'}`,
    '',
    `${env.ADMIN_URL}/enquiries/${enquiry.id}`,
  ].join('\n');

  return { to, subject, html: layout({ brand, preheader: subject, heading: 'New website enquiry', bodyHtml }), text, replyTo: enquiry.email };
}

/** Confirmation → the student who submitted the form. */
export function enquiryConfirmationEmail(enquiry, settings) {
  const brand = settings?.brand || 'GIA Educare';
  const firstName = String(enquiry.name || '').split(/\s+/)[0] || 'there';
  const subject = `We've got your enquiry, ${firstName}`;
  const whatsapp = settings?.socials?.whatsapp;

  const bodyHtml = `<p style="font-size:15px;line-height:1.6;margin:0 0 14px">Hi ${esc(firstName)}, thanks for reaching out. A senior counsellor will call you within <b>one working day</b> — counselling is free and there is no obligation to sign up for anything.</p>
<p style="font-size:14px;color:#5C6B84;margin:0 0 4px">Here is what you told us:</p>
${rows([
  ['Destination', enquiry.destination],
  ['Budget', enquiry.budget],
  ['Study level', enquiry.level],
  ['Intake', enquiry.intake],
])}
<p style="font-size:14px;line-height:1.6;margin:0 0 14px"><b>Before the call:</b> keep your latest marksheets and any test scores handy — it lets us be specific about your options on the call itself.</p>
${button(env.SITE_URL, `Visit ${brand}`)}
${whatsapp ? button(whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${digits(whatsapp)}`, 'Message us on WhatsApp', '#1FA855', '#ffffff') : ''}
<p style="font-size:13px;color:#5C6B84;margin:18px 0 0">Need us sooner? Call ${esc(settings?.phonePrimary || '')} or just reply to this email.</p>`;

  const text = `Hi ${firstName}, thanks for reaching out to ${brand}. A senior counsellor will call you within one working day.\n\nDestination: ${enquiry.destination || '-'}\nBudget: ${enquiry.budget || '-'}\n\nNeed us sooner? Call ${settings?.phonePrimary || ''}.`;

  return {
    to: enquiry.email,
    subject,
    html: layout({ brand, preheader: 'A counsellor will call you within one working day.', heading: 'Thank you — we have your enquiry', bodyHtml }),
    text,
    replyTo: settings?.emailAdmissions || settings?.emailPrimary || undefined,
  };
}

/** New admin account → the person who was added. Never includes the password. */
export function accountCreatedEmail(user, createdByName, brand = 'GIA Educare') {
  const subject = `You now have access to the ${brand} admin panel`;
  const bodyHtml = `<p style="font-size:15px;line-height:1.6;margin:0 0 14px">Hi ${esc(user.name)}, ${esc(createdByName || 'an administrator')} has added you to the ${esc(brand)} admin panel as <b>${esc(String(user.role).replace('_', ' '))}</b>.</p>
<p style="font-size:14px;line-height:1.6;margin:0 0 16px">Your temporary password will be shared with you separately. Please change it from <b>Profile</b> after your first sign-in.</p>
${button(`${env.ADMIN_URL}/login`, 'Sign in')}`;
  return {
    to: user.email,
    subject,
    html: layout({ brand, preheader: subject, heading: 'Welcome to the team', bodyHtml }),
    text: `${createdByName || 'An administrator'} added you to the ${brand} admin panel as ${user.role}. Sign in: ${env.ADMIN_URL}/login`,
  };
}

export function testEmail(to, brand = 'GIA Educare') {
  const subject = `${brand}: test email`;
  return {
    to,
    subject,
    html: layout({ brand, preheader: 'Email delivery is working.', heading: 'Email delivery is working', bodyHtml: '<p style="font-size:15px;margin:0">If you can read this, new-lead alerts and student confirmations will reach their inboxes.</p>' }),
    text: 'Email delivery is working.',
  };
}
