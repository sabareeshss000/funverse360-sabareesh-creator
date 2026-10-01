import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/funverse360';
  
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('[DB] ✅ Connected successfully to MongoDB!');
    return true;
  } catch (err) {
    console.warn(`[DB] ⚠️ Local MongoDB connection failed (${err.message}).`);
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    console.log('[DB] 🚀 Starting embedded MongoDB (In-Memory Server) for seamless zero-setup demo...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(memUri);
      console.log('[DB] ✅ Connected to In-Memory MongoDB at:', memUri);
      return true;
    } catch (memErr) {
      console.error('[DB] ❌ In-Memory MongoDB failed to initialize:', memErr.message);
      return false;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
