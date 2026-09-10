import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDb, disconnectDb } from './config/db.js';

async function start() {
  await connectDb();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}/api/v1 (${env.NODE_ENV})`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
    // Don't hang forever if a connection refuses to close.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled rejection: ${reason}`);
  });
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
  });
}

start().catch((err) => {
  logger.error(`Failed to start: ${err.message}`);
  process.exit(1);
});
