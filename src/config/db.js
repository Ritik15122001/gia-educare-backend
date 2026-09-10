import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);

export async function connectDb() {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    throw err;
  }
}

export async function disconnectDb() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
