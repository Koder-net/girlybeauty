import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/girlybeauty";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  isConnected: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null, isConnected: false };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached && cached.conn && cached.isConnected) {
    return cached.conn;
  }

  if (!cached) {
    cached = { conn: null, promise: null, isConnected: false };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        if (cached) cached.isConnected = true;
        return m;
      })
      .catch((err) => {
        console.warn("MongoDB connection notice (operating with memory store fallback):", err.message);
        if (cached) {
          cached.isConnected = false;
          cached.promise = null;
        }
        return null;
      });
  }

  try {
    const conn = await cached.promise;
    if (cached) cached.conn = conn;
    return conn;
  } catch {
    if (cached) {
      cached.promise = null;
      cached.isConnected = false;
    }
    return null;
  }
}

export function isDbConnected(): boolean {
  return !!(cached && cached.isConnected && mongoose.connection.readyState === 1);
}
