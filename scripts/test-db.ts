import connectDB from '@/lib/mongoDB';
import { MongoClient } from 'mongodb';

async function testDBConnection() {
  console.log('🧪 Testing MongoDB connection...\n');
  
  const isConnected = await connectDB();
  
  if (isConnected) {
    console.log('✅ MongoDB connection SUCCESSFUL!');
    
    try {
      const client = (globalThis as any).mongo?.client;
      if (client) {
        const dbs = await client.db().admin().listDatabases();
        console.log('\n📋 Available databases:');
        dbs.databases.forEach((db: any) => {
          console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
      }
    } catch (listError) {
      console.log('ℹ️  Connected but listing databases failed (normal if no perms):', listError);
    }
  } else {
    console.log('❌ MongoDB connection FAILED!');
    console.log('\n💡 Quick fix: Add to .env.local:');
    console.log("MONGODB_URI='mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority'");
    console.log('Get free URI from https://mongodb.com/atlas');
  }
  
  process.exit(isConnected ? 0 : 1);
}

testDBConnection().catch(console.error);

