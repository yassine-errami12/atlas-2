import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import seedDatabase from '../scripts/seed';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atlas-tech';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
    
    // Check if database is empty and seed it
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      if (collections.length === 0) {
        logger.info('Database is empty, seeding initial data...');
        await seedDatabase();
      }
    }
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
    throw error;
  }
};
