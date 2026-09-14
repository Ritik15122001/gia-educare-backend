import crypto from 'node:crypto';
import { env } from '../config/env.js';

/**
 * Arithmetic image captcha ("7 + 4 = ?"), verified on the server.
 *
 * Stateless by design: the answer never leaves the server in readable form.
 * The client gets an SVG plus a token that carries a nonce, an expiry and an
 * HMAC over (nonce, expiry, answer). Verifying recomputes the HMAC with the
 * submitted answer, so no challenge has to be stored — it survives restarts
 * and works across instances. The only state is a short-lived set of spent
 * nonces, which makes every token single-use (right or wrong).
 *
 * Glyphs are drawn as jittered stroke paths rather than <text>, so the answer
 * is not sitting in the SVG markup for a scraper to read.
 */

const TTL_MS = 5 * 60 * 1000;
const secret = crypto.createHmac('sha256', env.CAPTCHA_SECRET || env.JWT_ACCESS_SECRET).update('gia-captcha-v1').digest();

// nonce -> expiry. Pruned lazily; entries only need to outlive their token.
const spent = new Map();
function prune(now) {
  if (spent.size < 500) return;
  for (const [nonce, exp] of spent) if (exp < now) spent.delete(nonce);
}

const sign = (nonce, exp, answer) =>
  crypto.createHmac('sha256', secret).update(`${nonce}.${exp}.${answer}`).digest('base64url');

// --- glyphs on a 10 × 16 grid ---------------------------------------------
const GLYPHS = {
  0: [[[3, 1], [7, 1], [9, 4], [9, 12], [7, 15], [3, 15], [1, 12], [1, 4], [3, 1]]],
  1: [[[3, 4], [6, 1], [6, 15]], [[3, 15], [9, 15]]],
  2: [[[1, 4], [3, 1], [7, 1], [9, 3], [9, 6], [1, 15], [9, 15]]],
  3: [[[1, 2], [7, 1], [9, 4], [8, 7], [4, 8], [8, 9], [9, 12], [7, 15], [1, 14]]],
  4: [[[7, 15], [7, 1], [1, 11], [9, 11]]],
  5: [[[9, 1], [2, 1], [1, 7], [7, 7], [9, 9], [9, 13], [7, 15], [1, 15]]],
  6: [[[8, 1], [3, 3], [1, 8], [1, 13], [3, 15], [7, 15], [9, 13], [9, 10], [7, 8], [3, 8], [1, 10]]],
  7: [[[1, 1], [9, 1], [4, 15]], [[3, 8], [8, 8]]],
  8: [[[5, 8], [2, 6], [2, 3], [4, 1], [6, 1], [8, 3], [8, 6], [5, 8], [1, 11], [1, 13], [3, 15], [7, 15], [9, 13], [9, 11], [5, 8]]],
  9: [[[9, 6], [7, 8], [3, 8], [1, 6], [1, 3], [3, 1], [7, 1], [9, 3], [9, 8], [7, 13], [2, 15]]],
  '+': [[[5, 4], [5, 12]], [[1, 8], [9, 8]]],
  '-': [[[1, 8], [9, 8]]],
  '=': [[[1, 6], [9, 6]], [[1, 10], [9, 10]]],
  '?': [[[2, 4], [3, 1], [7, 1], [9, 3], [9, 6], [5, 9], [5, 11]], [[5, 14], [5, 15]]],
};

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const COLORS = ['#08192F', '#16345C', '#1C5C8A', '#5B3E8F', '#7C2C3B', '#1F6B63'];

function renderSvg(expression) {
  const width = 190;
  const height = 60;
  const scale = 2.3;
  const parts = [];

  // Background noise first so the glyphs sit on top of it.
  for (let i = 0; i < 5; i += 1) {
    parts.push(
      `<path d="M${rand(0, 40).toFixed(1)} ${rand(5, 55).toFixed(1)} C${rand(40, 90).toFixed(1)} ${rand(0, 60).toFixed(1)},${rand(90, 150).toFixed(1)} ${rand(0, 60).toFixed(1)},${rand(150, 190).toFixed(1)} ${rand(5, 55).toFixed(1)}" stroke="${COLORS[randInt(0, COLORS.length - 1)]}" stroke-opacity="${rand(0.15, 0.35).toFixed(2)}" stroke-width="${rand(1, 2).toFixed(1)}" fill="none"/>`,
    );
  }
  for (let i = 0; i < 40; i += 1) {
    parts.push(`<circle cx="${rand(0, width).toFixed(1)}" cy="${rand(0, height).toFixed(1)}" r="${rand(0.6, 1.6).toFixed(1)}" fill="#08192F" fill-opacity="${rand(0.08, 0.3).toFixed(2)}"/>`);
  }

  const chars = expression.split('');
  const advance = 25;
  let x = (width - chars.length * advance) / 2 + 2;

  chars.forEach((ch) => {
    const strokes = GLYPHS[ch];
    if (!strokes) { x += advance * 0.5; return; }
    const y = rand(8, 14);
    const angle = rand(-14, 14).toFixed(1);
    const cx = x + 5 * scale;
    const cy = y + 8 * scale;
    const color = COLORS[randInt(0, COLORS.length - 1)];
    const d = strokes
      .map((stroke) =>
        stroke
          .map(([gx, gy], i) => `${i ? 'L' : 'M'}${(x + gx * scale + rand(-0.9, 0.9)).toFixed(1)} ${(y + gy * scale + rand(-0.9, 0.9)).toFixed(1)}`)
          .join(' '),
      )
      .join(' ');
    parts.push(
      `<path d="${d}" transform="rotate(${angle} ${cx.toFixed(1)} ${cy.toFixed(1)})" stroke="${color}" stroke-width="${rand(2.4, 3).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    );
    x += advance;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" rx="8" fill="#F7F4EC"/>${parts.join('')}</svg>`;
}

/** A fresh challenge. `answer` is for server-side use only — never send it. */
export function createChallenge() {
  let a = randInt(2, 9);
  let b = randInt(1, 9);
  const op = Math.random() < 0.6 ? '+' : '-';
  if (op === '-' && b > a) [a, b] = [b, a];
  const answer = op === '+' ? a + b : a - b;

  const nonce = crypto.randomBytes(12).toString('base64url');
  const exp = Date.now() + TTL_MS;
  const token = Buffer.from(JSON.stringify({ n: nonce, e: exp, h: sign(nonce, exp, answer) })).toString('base64url');

  return { token, svg: renderSvg(`${a}${op}${b}=?`), expiresAt: new Date(exp).toISOString(), answer };
}

/**
 * Checks an answer. Always spends the token, so a wrong guess cannot be
 * retried against the same challenge.
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export function verifyChallenge(token, answer) {
  if (!token || answer === undefined || answer === null || answer === '') return { ok: false, reason: 'missing' };

  let payload;
  try {
    payload = JSON.parse(Buffer.from(String(token), 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  const { n: nonce, e: exp, h: mac } = payload || {};
  if (typeof nonce !== 'string' || typeof exp !== 'number' || typeof mac !== 'string') return { ok: false, reason: 'malformed' };

  const now = Date.now();
  if (exp < now) return { ok: false, reason: 'expired' };
  if (spent.has(nonce)) return { ok: false, reason: 'used' };

  prune(now);
  spent.set(nonce, exp);

  const normalized = String(answer).trim();
  if (!/^-?\d{1,3}$/.test(normalized)) return { ok: false, reason: 'wrong' };

  const expected = Buffer.from(sign(nonce, exp, Number(normalized)));
  const given = Buffer.from(mac);
  const match = expected.length === given.length && crypto.timingSafeEqual(expected, given);
  return match ? { ok: true } : { ok: false, reason: 'wrong' };
}
