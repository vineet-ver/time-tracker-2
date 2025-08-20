import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI as string | undefined;
    if (!uri) {
      throw new Error("Missing MONGODB_URI. Add it to .env.local");
    }
    connectionPromise = mongoose.connect(uri, {});
  }
  return connectionPromise;
}


