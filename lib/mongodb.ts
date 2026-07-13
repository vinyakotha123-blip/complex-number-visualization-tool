import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

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

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connects to MongoDB using a cached connection to avoid exhausting
 * connections during Next.js hot-reload / serverless invocations.
 * Falls back to an embedded MongoDB instance when no external database is available.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connectWithFallback();
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

async function connectWithFallback(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cnvt';
  const dbName = process.env.MONGODB_DB || 'cnvt';

  try {
    return await mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
    });
  } catch (err) {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create({
        instance: { dbName },
      });
      process.env.MONGODB_URI = mongoServer.getUri();
      return await mongoose.connect(process.env.MONGODB_URI, {
        dbName,
        bufferCommands: false,
      });
    }

    throw err;
  }
}
