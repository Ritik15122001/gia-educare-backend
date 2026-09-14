import crypto from 'node:crypto';
import { env } from '../config/env.js';

/**
 * Encrypts small secrets (the SMTP password) for storage in MongoDB with
 * AES-256-GCM, using only node:crypto.
 *
 * The key comes from SETTINGS_SECRET, falling back to JWT_ACCESS_SECRET. If
 * that secret changes, stored values can no longer be decrypted — `open()`
 * then returns null and the admin is asked to re-enter the password rather
 * than the server crashing.
 */

const key = crypto
  .createHash('sha256')
  .update(`gia-settings-v1:${env.SETTINGS_SECRET || env.JWT_ACCESS_SECRET}`)
  .digest();

// Output: "v1.<iv>.<authTag>.<ciphertext>", all base64url.
export function seal(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), data.toString('base64url')].join('.');
}

/** @returns {string | null} null when the value is missing, tampered with or sealed under another key. */
export function open(sealed) {
  if (!sealed) return null;
  try {
    const [version, iv, tag, data] = String(sealed).split('.');
    if (version !== 'v1') return null;
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
