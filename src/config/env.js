import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(8, 'JWT_ACCESS_SECRET must be at least 8 chars'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 chars'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:5183,http://localhost:5174'),
  // Cross-site cookies: when the admin panel is served from a different domain
  // than this API, the refresh cookie must be SameSite=None + Secure or the
  // browser will silently drop it.
  COOKIE_SAMESITE: z.enum(['none', 'lax', 'strict']).default('none'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('true'),
  SEED_ADMIN_NAME: z.string().default('GIA Admin'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@giaeducare.com'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('Admin@12345'),
  PUBLIC_URL: z.string().default('http://localhost:5000'),

  // Where the public website and the admin panel live — used to build links in
  // outgoing emails.
  SITE_URL: z.string().default('http://localhost:5183'),
  ADMIN_URL: z.string().default('http://localhost:5174'),

  // Outgoing email (any SMTP provider: Gmail, Zoho, SES, SendGrid, Brevo…).
  // Leave SMTP_HOST empty and emails are logged instead of sent, so local
  // development never needs credentials.
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.enum(['true', 'false']).default('false'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  EMAIL_FROM: z.string().default('GIA Educare <no-reply@giaeducare.com>'),

  // Signs captcha tokens. Falls back to JWT_ACCESS_SECRET when unset.
  CAPTCHA_SECRET: z.string().default(''),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  // eslint-disable-next-line no-console
  console.error(`\nInvalid environment configuration:\n${issues}\n\nCopy .env.example to .env and fill it in.\n`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === 'production',
  isDev: parsed.data.NODE_ENV === 'development',
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  // "*" opens the API to every origin (see the cors() setup in app.js).
  allowAllOrigins: parsed.data.CORS_ORIGINS.trim() === '*',
  cookieSameSite: parsed.data.COOKIE_SAMESITE,
  cookieSecure: parsed.data.COOKIE_SECURE === 'true',
  smtpSecure: parsed.data.SMTP_SECURE === 'true',
  emailEnabled: Boolean(parsed.data.SMTP_HOST),
};
