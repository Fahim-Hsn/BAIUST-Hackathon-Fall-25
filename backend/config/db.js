import mongoose from 'mongoose';

export async function connectToDatabase() {
  const fallbackUri = 'mongodb://127.0.0.1:27017/';
  const mongoUri = process.env.MONGO_URI || fallbackUri;

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB || 'monbondhu'
  });

  const safeUri = maskMongoUri(mongoUri);
  console.log(`Connected to MongoDB: ${safeUri} (db=${process.env.MONGO_DB || 'monbondhu'})`);
}

export function getDbStatus() {
  const readyState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  return {
    connected: readyState === 1,
    readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || (process.env.MONGO_DB || 'monbondhu')
  };
}

function maskMongoUri(uri) {
  try {
    if (!uri) return '';
    // Hide credentials if present
    const parts = uri.split('@');
    if (parts.length === 2) {
      const left = parts[0];
      const right = parts[1];
      // keep scheme
      const scheme = left.includes('://') ? left.split('://')[0] : 'mongodb';
      return `${scheme}://***:***@${right}`;
    }
    return uri;
  } catch {
    return uri;
  }
}


