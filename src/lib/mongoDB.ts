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
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.error('❌ MongoDB connection failed: missing MONGODB_URI')
      return false
    }

    // Log minimal diagnostics (do not print credentials)
    const redacted = mongoUri.replace(/(mongodb\+srv:\/\/)([^@/]+)@/,'$1***:***@')
    console.log('🔌 MongoDB attempting connect:', redacted)

    const clientPromise = new MongoClient(mongoUri)
    const client = await clientPromise.connect();
    global.mongo = { client };
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed details:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : undefined,
    })
    return false;
  }
}

export default connectDB;
