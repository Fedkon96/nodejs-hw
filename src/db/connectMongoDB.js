import mongoose from 'mongoose';
import { Note } from '../models/note.js';

export const connectMongoDB = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error('MONGO_URL is not set in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');

    try {
      await Note.syncIndexes();
      console.log('✅ Note indexes synced successfully');
    } catch (syncErr) {
      console.warn('Note syncIndexes warning:', syncErr.message);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
