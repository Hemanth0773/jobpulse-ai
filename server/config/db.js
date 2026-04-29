import mongoose from 'mongoose';

let dbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');
    dbConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️ Running with in-memory mock data (MongoDB not required)');
    dbConnected = false;
  }
};

export const isDbConnected = () => dbConnected;
export default connectDB;
