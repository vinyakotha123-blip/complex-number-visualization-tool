import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

/**
 * Connects to MongoDB using a cached connection to avoid exhausting
 * connections during Next.js hot-reload / serverless invocations.
 * If no MongoDB URI is configured, the routes will return an explicit
 * configuration error instead of trying to start an embedded server.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connectWithConfiguredUri();
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

async function connectWithConfiguredUri(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Set it in Vercel/your environment to enable saved graph persistence.');
  }

  const dbName = process.env.MONGODB_DB || 'cnvt';
  return mongoose.connect(uri, {
    dbName,
    bufferCommands: false,
  });
}
