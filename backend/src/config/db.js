const mongoose = require('mongoose');

let connectionPromise;

async function connectDb() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGO_URI or MONGODB_URI is not set');
  }

  if (mongoose.connection.readyState === 1) return;
  if (connectionPromise) return connectionPromise;

  mongoose.set('strictQuery', true);
  connectionPromise = mongoose
    .connect(uri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => {
      connectionPromise = null;
      console.error('MongoDB connection failed:', error.message);
      throw error;
    });

  return connectionPromise;
}

module.exports = { connectDb };