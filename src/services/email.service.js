import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { EmailConfig } from '../models/EmailConfig.js';
import { EmailLog } from '../models/EmailLog.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { open } from '../utils/secretBox.js';

/**
 * Outgoing email.
 *
 * SMTP settings come from the admin panel (EmailConfig) when they are saved and
 * switched on, otherwise from the SMTP_* environment variables, otherwise email
 * is logged instead of sent. Lead notifications are best-effort: callers use
 * `queueLeadNotifications()` / `queueEmail()` so a mail failure never fails the
 * request. Every attempt is written to EmailLog for the admin's delivery log.
 */

// --- configuration ----------------------------------------------------------

const CACHE_MS = 30_000;
let cache = { at: 0, value: null };
let transport = { fingerprint: '', instance: null };

/** Call after the admin saves SMTP settings so the next send uses them. */
export function invalidateEmailConfig() {
  cache = { at: 0, value: null };
  transport = { fingerprint: '', instance: null };
}

/**
 * @returns {Promise<{ smtp: object | null, prefs: object, source: 'admin' | 'environment' | 'none', problem: string }>}
 */
export async function resolveEmailConfig({ fresh = false } = {}) {
  if (!fresh && cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;

  const db = await EmailConfig.getSingleton({ withPassword: true }).catch((err) => {
    logger.error(`Could not load email settings: ${err.message}`);
    return null;
  });

  const prefs = {
    adminRecipients: db?.adminRecipients || '',
    notifyAdmin: db ? db.notifyAdmin !== false : true,
    notifyStudent: db ? db.notifyStudent !== false : true,
  };

  let smtp = null;
  let source = 'none';
  let problem = '';

  if (db?.enabled && db.host) {
    const password = db.passwordSealed ? open(db.passwordSealed) : '';
    if (db.passwordSealed && password === null) {
      problem = 'The saved SMTP password can no longer be read (the server secret changed). Re-enter it in Email & SMTP.';
    }
    smtp = {
      host: db.host,
      port: db.port,
      security: db.security,
      username: db.username,
      password: password || '',
      from: { name: db.fromName || '', address: db.fromEmail || db.username },
      replyTo: db.replyTo || '',
    };
    source = 'admin';
    if (!smtp.from.address) problem = problem || 'Set a "From" email address in Email & SMTP.';
  } else if (env.emailEnabled) {
    smtp = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      security: env.smtpSecure ? 'ssl' : 'starttls',
      username: env.SMTP_USER,
      password: env.SMTP_PASS,
      from: env.EMAIL_FROM,
      replyTo: '',
    };
    source = 'environment';
  }

  const value = { smtp, prefs, source, problem };
  cache = { at: Date.now(), value };
  return value;
}

function buildTransport(smtp) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port),
    secure: smtp.security === 'ssl',
    requireTLS: smtp.security === 'starttls',
    ignoreTLS: smtp.security === 'none',
    auth: smtp.username ? { user: smtp.username, pass: smtp.password } : undefined,
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

function getTransport(smtp) {
  const fingerprint = JSON.stringify([smtp.host, smtp.port, smtp.security, smtp.username, smtp.password]);
  if (transport.fingerprint !== fingerprint) {
    transport.instance?.close?.();
    transport = { fingerprint, instance: buildTransport(smtp) };
  }
  return transport.instance;
}

/** Turns nodemailer's errors into something an admin can act on. */
export function explainSmtpError(err, smtp = {}) {
  const code = err?.code || '';
  const where = smtp.host ? `${smtp.host}:${smtp.port}` : 'the mail server';
  if (code === 'EAUTH') {
    return 'The mail server rejected the username or password. With Gmail, Outlook or Zoho and 2-step verification on, create an app password and use that instead of your normal password.';
  }
  if (['ECONNECTION', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EDNS'].includes(code) || /ENOTFOUND|ECONNREFUSED|ETIMEDOUT/.test(err?.message || '')) {
    return `Could not connect to ${where}. Check the host and port — 587 usually uses STARTTLS and 465 uses SSL/TLS.`;
  }
  if (code === 'ESOCKET' || /wrong version number|certificate|SSL|TLS/i.test(err?.message || '')) {
    return `The secure connection to ${where} failed. Try the other security option (port 465 → SSL/TLS, port 587 → STARTTLS).`;
  }
  if (code === 'EENVELOPE') {
    return `The mail server refused the sender or recipient address: ${err.message}. Many providers only allow sending from the account's own address.`;
  }
  return err?.message || 'Unknown email error';
}

const splitRecipients = (value) =>
  (Array.isArray(value) ? value : String(value || '').split(','))
    .map((s) => String(s).trim())
    .filter(Boolean);

async function writeLog(entry) {
  try {
    await EmailLog.create(entry);
  } catch (err) {
    logger.warn(`Could not write email log: ${err.message}`);
  }
}

/**
 * Sends one message and records the attempt.
 * @param {{ to, subject, html, text, replyTo }} message
 * @param {{ type?: string, enquiryId?: string, throwOnError?: boolean, smtp?: object }} options
 */
export async function sendEmail(message, { type = 'test', enquiryId = null, throwOnError = false, smtp: override } = {}) {
  const recipients = splitRecipients(message.to);
  const base = { type, to: recipients, subject: message.subject, enquiry: enquiryId };

  if (!recipients.length) {
    await writeLog({ ...base, status: 'skipped', error: 'No recipient address' });
    if (throwOnError) throw new Error('No recipient address');
    return { skipped: 'no recipients' };
  }

  const config = override ? { smtp: override, problem: '' } : await resolveEmailConfig();
  if (!config.smtp) {
    logger.info(`[email:log-only] to=${recipients.join(', ')} subject="${message.subject}"`);
    await writeLog({ ...base, status: 'skipped', error: 'Email is not set up — add SMTP details in Email & SMTP' });
    if (throwOnError) throw new Error('Email is not set up yet — add your SMTP details and switch sending on.');
    return { skipped: 'smtp not configured' };
  }
  if (config.problem) {
    await writeLog({ ...base, status: 'failed', error: config.problem });
    if (throwOnError) throw new Error(config.problem);
    return { skipped: config.problem };
  }

  try {
    const info = await getTransport(config.smtp).sendMail({
      from: config.smtp.from,
      to: recipients,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo || config.smtp.replyTo || undefined,
    });
    logger.info(`[email] sent "${message.subject}" → ${recipients.join(', ')} (${info.messageId})`);
    await writeLog({ ...base, status: 'sent', messageId: info.messageId || '' });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    const reason = explainSmtpError(err, config.smtp);
    logger.error(`[email] failed "${message.subject}" → ${recipients.join(', ')}: ${err.message}`);
    await writeLog({ ...base, status: 'failed', error: reason });
    if (throwOnError) {
      const wrapped = new Error(reason);
      wrapped.cause = err;
      throw wrapped;
    }
    return { failed: reason };
  }
}

/** Opens a connection and authenticates without sending anything. */
export async function verifySmtp(smtp) {
  const probe = buildTransport(smtp);
  try {
    await probe.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: explainSmtpError(err, smtp) };
  } finally {
    probe.close();
  }
}

// Fire-and-forget — the HTTP response has already gone out.
export function queueEmail(message, options) {
  setImmediate(() => {
    sendEmail(message, options).catch((err) => logger.error(`[email] ${err.message}`));
  });
}

/** Sends the team alert and the student confirmation for a new lead, per the admin's switches. */
export async function notifyNewEnquiry(enquiry) {
  const [settings, config] = await Promise.all([SiteSetting.getSingleton(), resolveEmailConfig()]);
  const { prefs } = config;
  const enquiryId = enquiry.id || enquiry._id;
  const results = {};

  if (prefs.notifyAdmin) {
    const to = prefs.adminRecipients || settings.notifyEnquiriesTo || settings.emailAdmissions || settings.emailPrimary;
    results.admin = await sendEmail({ ...enquiryAlertEmail(enquiry, settings), to }, { type: 'lead-admin-alert', enquiryId });
  }
  if (prefs.notifyStudent) {
    results.student = await sendEmail(enquiryConfirmationEmail(enquiry, settings), { type: 'lead-student-confirmation', enquiryId });
  }
  return results;
}

export function queueLeadNotifications(enquiry) {
  setImmediate(() => {
    notifyNewEnquiry(enquiry).catch((err) => logger.error(`[email] lead notifications failed: ${err.message}`));
  });
}

// --- templates --------------------------------------------------------------

// Every value that reaches an email body is user-controlled somewhere upstream.
const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const digits = (v) => String(v || '').replace(/\D/g, '');
const C = { ink: '#08192F', ink3: '#16345C', gold: '#C9A44D', goldText: '#8A6B18', cream: '#FAF7F0', line: '#E7E2D7', muted: '#5C6B84', text: '#12203A', green: '#1FA855' };
const FONT = "'Plus Jakarta Sans',-apple-system,'Segoe UI',Arial,Helvetica,sans-serif";

const absolute = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${env.SITE_URL.replace(/\/$/, '')}/${String(url).replace(/^\//, '')}`;
};

const istDate = (date) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(date || Date.now()));

const button = (href, label, bg = C.gold, fg = C.ink) =>
  href
    ? `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${fg};text-decoration:none;font-weight:700;font-size:14px;line-height:1;padding:13px 20px;border-radius:999px;margin:0 8px 8px 0;font-family:${FONT}">${esc(label)}</a>`
    : '';

const table = (pairs) => {
  const rows = pairs.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '');
  if (!rows.length) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:4px 0 20px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.line};color:${C.muted};font-size:13px;width:38%;vertical-align:top;font-family:${FONT}">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid ${C.line};color:${C.text};font-size:14px;font-weight:700;vertical-align:top;font-family:${FONT}">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`;
};

const sectionTitle = (text) =>
  `<p style="margin:26px 0 6px;font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:${C.goldText};font-family:${FONT}">${esc(text)}</p>`;

/** Branded shell matching the website: navy header, gold accents, cream ground. */
function layout({ settings, preheader, eyebrow, heading, bodyHtml, footerNote }) {
  const brand = settings?.brand || 'GIA Educare';
  const logo = absolute(settings?.logoUrl || '/logo.jpg');
  const socials = Object.entries(settings?.socials || {}).filter(([, url]) => url);
  const contact = [
    settings?.phonePrimary && `<a href="tel:+${digits(settings.phonePrimary)}" style="color:${C.ink3};text-decoration:none">${esc(settings.phonePrimary)}</a>`,
    settings?.emailPrimary && `<a href="mailto:${esc(settings.emailPrimary)}" style="color:${C.ink3};text-decoration:none">${esc(settings.emailPrimary)}</a>`,
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-text-size-adjust:100%">
<span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid ${C.line};border-radius:18px;overflow:hidden">
  <tr><td style="background:${C.ink};padding:22px 30px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle"><span style="display:inline-block;background:#ffffff;border-radius:10px;padding:6px 10px;line-height:0"><img src="${esc(logo)}" alt="${esc(brand)}" height="40" style="display:block;height:40px;width:auto;border:0"></span></td>
      <td align="right" style="vertical-align:middle;font-family:${FONT}"><span style="color:#ffffff;font-size:16px;font-weight:700">${esc(brand)}</span><br><span style="color:${C.gold};font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:700">${esc(settings?.tagline || 'Study · Apply · Fly')}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;background:${C.gold};line-height:4px;font-size:0">&nbsp;</td></tr>
  <tr><td style="padding:32px 30px 10px;font-family:${FONT};color:${C.text}">
    ${eyebrow ? `<p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:${C.goldText}">${esc(eyebrow)}</p>` : ''}
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:${C.ink};font-family:Poppins,${FONT}">${esc(heading)}</h1>
    ${bodyHtml}
  </td></tr>
  <tr><td style="padding:22px 30px;background:${C.cream};border-top:1px solid ${C.line};font-family:${FONT}">
    <p style="margin:0 0 6px;font-size:13px;color:${C.text};font-weight:700">${esc(brand)}</p>
    ${settings?.addressLine ? `<p style="margin:0 0 6px;font-size:12px;color:${C.muted}">${esc(settings.addressLine)}</p>` : ''}
    ${contact ? `<p style="margin:0 0 6px;font-size:12px;color:${C.muted}">${contact}</p>` : ''}
    ${socials.length ? `<p style="margin:0 0 6px;font-size:12px">${socials.map(([name, url]) => `<a href="${esc(url)}" style="color:${C.goldText};text-decoration:none;text-transform:capitalize;margin-right:12px">${esc(name)}</a>`).join('')}</p>` : ''}
    ${footerNote ? `<p style="margin:10px 0 0;font-size:11px;color:${C.muted}">${footerNote}</p>` : ''}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const fullPhone = (e) => `${e.code || ''} ${e.phone || ''}`.trim();

/** New lead → the team inbox. */
export function enquiryAlertEmail(enquiry, settings) {
  const brand = settings?.brand || 'GIA Educare';
  const phone = fullPhone(enquiry);
  const intl = digits(`${enquiry.code || ''}${enquiry.phone || ''}`);
  const subject = `New lead: ${enquiry.name}${enquiry.destination ? ` → ${enquiry.destination}` : ''}${enquiry.budget ? ` · ${enquiry.budget}` : ''}`;
  const campaign = [enquiry.utmSource, enquiry.utmMedium, enquiry.utmCampaign].filter(Boolean).join(' / ');

  const chips = [enquiry.destination, enquiry.budget, enquiry.level, enquiry.intake]
    .filter(Boolean)
    .map((c) => `<span style="display:inline-block;background:${C.cream};border:1px solid ${C.line};color:${C.ink};font-size:12px;font-weight:700;padding:6px 12px;border-radius:999px;margin:0 6px 6px 0">${esc(c)}</span>`)
    .join('');

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${C.muted}">A new enquiry just came in from the website on <b style="color:${C.text}">${esc(istDate(enquiry.createdAt))} IST</b>. Call within the hour for the best conversion.</p>
    ${chips ? `<div style="margin:0 0 18px">${chips}</div>` : ''}
    <div style="margin:0 0 6px">
      ${button(intl ? `tel:+${intl}` : '', `Call ${phone}`, C.ink, '#ffffff')}
      ${button(intl ? `https://wa.me/${intl}` : '', 'WhatsApp', C.green, '#ffffff')}
      ${button(`mailto:${enquiry.email}`, 'Reply by email')}
    </div>
    ${sectionTitle('Student')}
    ${table([
      ['Name', enquiry.name],
      ['Email', enquiry.email],
      ['Phone', phone],
      ['Preferred destination', enquiry.destination],
      ['Total budget', enquiry.budget],
      ['Study level', enquiry.level],
      ['Preferred intake', enquiry.intake],
      ['Test status', enquiry.test],
      ['Highest qualification', enquiry.qual],
    ])}
    ${enquiry.message ? `${sectionTitle('Message')}<div style="background:${C.cream};border-left:3px solid ${C.gold};padding:14px 16px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.6;color:${C.text};margin:0 0 20px">${esc(enquiry.message).replace(/\n/g, '<br>')}</div>` : ''}
    ${sectionTitle('Source')}
    ${table([
      ['Referral code', enquiry.referral],
      ['Campaign', campaign],
      ['Form page', enquiry.sourcePage],
      ['Landing page', enquiry.landingPage],
      ['Referring site', enquiry.referrerUrl],
    ]) || `<p style="margin:0 0 20px;font-size:13px;color:${C.muted}">Direct visit — no referral or campaign.</p>`}
    <div style="margin:8px 0 22px">${button(`${env.ADMIN_URL}/enquiries/${enquiry.id || enquiry._id}`, 'Open lead in admin →')}</div>`;

  const text = [
    `New lead: ${enquiry.name}`,
    `Received: ${istDate(enquiry.createdAt)} IST`,
    '',
    `Email: ${enquiry.email}`,
    `Phone: ${phone}`,
    `Destination: ${enquiry.destination || '-'}`,
    `Budget: ${enquiry.budget || '-'}`,
    `Level / intake: ${enquiry.level || '-'} / ${enquiry.intake || '-'}`,
    `Test: ${enquiry.test || '-'} | Qualification: ${enquiry.qual || '-'}`,
    `Referral: ${enquiry.referral || '-'} | Campaign: ${campaign || '-'}`,
    `Message: ${enquiry.message || '-'}`,
    '',
    `Open in admin: ${env.ADMIN_URL}/enquiries/${enquiry.id || enquiry._id}`,
  ].join('\n');

  return {
    subject,
    html: layout({
      settings,
      preheader: `${enquiry.name} · ${enquiry.destination || 'destination not chosen'} · ${enquiry.budget || 'budget not given'}`,
      eyebrow: 'New website lead',
      heading: `${enquiry.name} wants to study abroad`,
      bodyHtml,
      footerNote: `You're receiving this because new-lead alerts are switched on for ${esc(brand)}. Manage recipients in Admin → Email &amp; SMTP.`,
    }),
    text,
    replyTo: enquiry.email,
  };
}

/** Confirmation → the student who submitted the form. */
export function enquiryConfirmationEmail(enquiry, settings) {
  const brand = settings?.brand || 'GIA Educare';
  const firstName = String(enquiry.name || '').trim().split(/\s+/)[0] || 'there';
  const whatsapp = settings?.socials?.whatsapp || settings?.phonePrimary;
  const waHref = whatsapp ? (/^https?:/i.test(whatsapp) ? whatsapp : `https://wa.me/${digits(whatsapp)}`) : '';
  const subject = `Thanks, ${firstName} — your ${brand} counselling request is confirmed`;

  const step = (n, title, body) =>
    `<tr><td style="vertical-align:top;padding:0 14px 16px 0;width:34px"><div style="width:32px;height:32px;border-radius:50%;background:${C.ink};color:${C.gold};font-weight:800;font-size:14px;line-height:32px;text-align:center;font-family:${FONT}">${n}</div></td><td style="vertical-align:top;padding:0 0 16px;font-family:${FONT}"><p style="margin:2px 0 3px;font-size:15px;font-weight:700;color:${C.ink}">${esc(title)}</p><p style="margin:0;font-size:14px;line-height:1.55;color:${C.muted}">${body}</p></td></tr>`;

  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:${C.text}">Hi ${esc(firstName)}, thank you for reaching out. We've received your details and a senior counsellor will personally look at your profile. Counselling is <b>completely free</b> and there's no obligation to sign up for anything.</p>
    ${sectionTitle('What happens next')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 6px">
      ${step(1, 'We review your profile', 'Your destination, budget and academic background are matched with the right counsellor.')}
      ${step(2, 'We call you within one working day', `Expect a call on <b style="color:${C.text}">${esc(fullPhone(enquiry))}</b>. If you miss it, we'll WhatsApp you.`)}
      ${step(3, 'You get an honest plan', 'Realistic universities, total costs in INR, the tests you need and a timeline — on the call itself.')}
    </table>
    ${sectionTitle('What you told us')}
    ${table([
      ['Preferred destination', enquiry.destination],
      ['Total budget', enquiry.budget],
      ['Study level', enquiry.level],
      ['Preferred intake', enquiry.intake],
      ['Test status', enquiry.test],
    ])}
    <div style="background:${C.cream};border:1px solid ${C.line};border-radius:12px;padding:16px 18px;margin:0 0 22px">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:${C.ink};font-family:${FONT}">Before the call</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};font-family:${FONT}">Keep your latest marksheets, any test scores and a rough budget handy — it lets us be specific about your options straight away.</p>
    </div>
    <div style="margin:0 0 22px">
      ${button(waHref, 'Message us on WhatsApp', C.green, '#ffffff')}
      ${button(env.SITE_URL, `Explore ${brand}`)}
    </div>
    <p style="margin:0 0 22px;font-size:13px;color:${C.muted};font-family:${FONT}">Can't wait? Call ${esc(settings?.phonePrimary || '')} or simply reply to this email.</p>`;

  const text = [
    `Hi ${firstName},`,
    '',
    `Thank you for contacting ${brand}. A senior counsellor will call you within one working day on ${fullPhone(enquiry)}.`,
    '',
    `Destination: ${enquiry.destination || '-'}`,
    `Budget: ${enquiry.budget || '-'}`,
    `Study level: ${enquiry.level || '-'}`,
    `Intake: ${enquiry.intake || '-'}`,
    '',
    `Need us sooner? Call ${settings?.phonePrimary || ''} or reply to this email.`,
    brand,
  ].join('\n');

  return {
    to: enquiry.email,
    subject,
    html: layout({
      settings,
      preheader: 'A senior counsellor will call you within one working day.',
      eyebrow: 'Enquiry received',
      heading: `Thank you, ${firstName} — we've got your enquiry`,
      bodyHtml,
      footerNote: `You're receiving this because you submitted an enquiry on the ${esc(brand)} website. We never sell your data.`,
    }),
    text,
    replyTo: settings?.emailAdmissions || settings?.emailPrimary || undefined,
  };
}

/** New admin account → the person who was added. Never includes the password. */
export function accountCreatedEmail(user, createdByName, settingsOrBrand) {
  const settings = typeof settingsOrBrand === 'object' && settingsOrBrand ? settingsOrBrand : { brand: settingsOrBrand || 'GIA Educare' };
  const brand = settings.brand || 'GIA Educare';
  const subject = `You now have access to the ${brand} admin panel`;
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65">Hi ${esc(user.name)}, ${esc(createdByName || 'an administrator')} has added you to the ${esc(brand)} admin panel as <b>${esc(String(user.roleName || user.role).replace('_', ' '))}</b>.</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.muted}">Your temporary password will be shared with you separately. Please change it from <b>Profile</b> after your first sign-in.</p>
    <div style="margin:0 0 22px">${button(`${env.ADMIN_URL}/login`, 'Sign in to the admin panel')}</div>`;
  return {
    to: user.email,
    subject,
    html: layout({ settings, preheader: subject, eyebrow: 'Team access', heading: 'Welcome to the team', bodyHtml }),
    text: `${createdByName || 'An administrator'} added you to the ${brand} admin panel. Sign in: ${env.ADMIN_URL}/login`,
  };
}

export function testEmail(to, settings) {
  const brand = settings?.brand || 'GIA Educare';
  return {
    to,
    subject: `${brand}: your email settings are working`,
    html: layout({
      settings,
      preheader: 'Email delivery is working.',
      eyebrow: 'Test email',
      heading: 'Your email settings are working',
      bodyHtml: `<p style="margin:0 0 22px;font-size:15px;line-height:1.65">If you're reading this, ${esc(brand)} can send email. New-lead alerts and student confirmations will use these same settings.</p>`,
    }),
    text: `Your ${brand} email settings are working.`,
  };
}

/** Sample lead for template previews in the admin. */
export const SAMPLE_ENQUIRY = {
  id: 'preview',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  code: '+91',
  phone: '9811122334',
  destination: 'Canada',
  budget: '₹20 – 30 Lakh',
  level: 'Masters',
  intake: 'Sep 2027',
  test: 'IELTS done',
  qual: 'Bachelors — completed',
  message: 'I have two backlogs and need guidance on education loans.',
  referral: 'PARTNER-DELHI-12',
  utmSource: 'instagram',
  utmMedium: 'social',
  utmCampaign: 'sept-intake',
  sourcePage: '/contact',
  landingPage: '/destinations/canada',
  createdAt: new Date(),
};
