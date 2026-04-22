import { MongoClient } from 'mongodb';

declare global {
  var mongo: {
    client: MongoClient;
  } | undefined;
}

async function connectDB(): Promise<boolean> {
  if (global.mongo?.client) {
    console.log('✅ Using cached MongoDB connection');
    return true;
  }

  try {
    const clientPromise = new MongoClient(process.env.MONGODB_URI!);
    const client = await clientPromise.connect();
    global.mongo = { client };
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

export default connectDB;
