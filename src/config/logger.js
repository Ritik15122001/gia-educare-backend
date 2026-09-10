import { env } from './env.js';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const active = LEVELS[env.isProd ? 'info' : 'debug'];

function emit(level, message, meta) {
  if (LEVELS[level] > active) return;
  const line = { ts: new Date().toISOString(), level, message, ...(meta ? { meta } : {}) };
  const out = level === 'error' ? console.error : console.log;
  out(env.isProd ? JSON.stringify(line) : `${line.ts} [${level.toUpperCase()}] ${message}${meta ? ` ${JSON.stringify(meta)}` : ''}`);
}

export const logger = {
  error: (m, meta) => emit('error', m, meta),
  warn: (m, meta) => emit('warn', m, meta),
  info: (m, meta) => emit('info', m, meta),
  debug: (m, meta) => emit('debug', m, meta),
};
