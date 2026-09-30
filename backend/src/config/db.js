const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGO_URI or MONGODB_URI is not set');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = { connectDb };