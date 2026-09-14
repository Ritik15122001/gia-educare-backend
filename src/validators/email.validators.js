import { z } from 'zod';
import { SMTP_SECURITY } from '../models/EmailConfig.js';

const optionalEmail = z.string().trim().toLowerCase().email('Enter a valid email address').or(z.literal(''));
const emailList = z
  .string()
  .trim()
  .max(1000)
  .refine(
    (v) => !v || v.split(',').every((e) => z.string().email().safeParse(e.trim()).success),
    'Use valid email addresses, separated by commas',
  );

const smtpFields = {
  host: z.string().trim().max(200).regex(/^[a-zA-Z0-9.-]*$/, 'Enter a host name like smtp.gmail.com'),
  port: z.coerce.number().int().min(1, 'Enter a port').max(65535),
  security: z.enum(SMTP_SECURITY),
  username: z.string().trim().max(200),
  // Blank means "keep the saved password".
  password: z.string().max(500).optional(),
};

export const emailConfigSchema = z
  .object({
    enabled: z.boolean(),
    ...smtpFields,
    clearPassword: z.boolean().optional(),
    // No line breaks or brackets: this ends up in a From header.
    fromName: z.string().trim().max(100).regex(/^[^\r\n<>"]*$/, 'Remove line breaks, quotes and angle brackets'),
    fromEmail: optionalEmail,
    replyTo: optionalEmail,
    adminRecipients: emailList,
    notifyAdmin: z.boolean(),
    notifyStudent: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (!v.enabled) return;
    if (!v.host) ctx.addIssue({ code: 'custom', path: ['host'], message: 'A host is required to send email' });
    if (!v.fromEmail) ctx.addIssue({ code: 'custom', path: ['fromEmail'], message: 'A From address is required to send email' });
  });

export const smtpVerifySchema = z.object({
  ...smtpFields,
  host: smtpFields.host.min(1, 'Enter the SMTP host'),
});

export const testEmailSchema = z.object({
  to: z.string().trim().email('Enter a valid email address'),
});
