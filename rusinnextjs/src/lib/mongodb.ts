import mongoose from "mongoose";
import { resolveSrv } from "dns/promises"; // 👈 1. Import DNS resolver

const MONGODB_URI = process.env.MONGODB_URI;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose cache for Next.js hot-reloading
declare global {
  var mongooseCache: CachedConnection;
}

let cached: CachedConnection = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 * Uses caching to avoid multiple connections in development (Turbopack reloads)
 */
export async function connectToDatabase() {
  // ---------------------------------------------------------
  // 1. CI/CD BUILD-TIME BYPASS
  // Intercept the dummy URI from GitHub Actions so it doesn't try to connect
  // ---------------------------------------------------------
  if (MONGODB_URI === "mongodb://build-time-dummy") {
    console.warn("⚠️ Build time detected. Skipping actual MongoDB connection.");
    return mongoose;
  }

  // ---------------------------------------------------------
  // 2. RUNTIME MISSING VAR CHECK
  // ---------------------------------------------------------
  if (!MONGODB_URI) {
    throw new Error(
      "❌ Please define the MONGODB_URI environment variable inside ECS or .env.local",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // ---------------------------------------------------------
    // 3. AWS CLOUD MAP SRV INTERCEPTOR
    // ---------------------------------------------------------
    let activeUri = MONGODB_URI;

    if (activeUri.startsWith("mongodb+srv://")) {
      try {
        // Extract the domain cleanly without regex
        const urlObj = new URL(activeUri);
        const domain = urlObj.hostname;

        console.log(`🔍 Looking up AWS Cloud Map SRV record for: ${domain}`);

        // Ask the internal AWS DNS for the EC2 IP and dynamic port
        const records = await resolveSrv(domain);

        if (records && records.length > 0) {
          const { name, port } = records[0];

          // Rewrite the string to standard mongodb:// with the exact port
          activeUri = activeUri
            .replace("mongodb+srv://", "mongodb://")
            .replace(domain, `${name}:${port}`);

          console.log(`✅ Successfully rebuilt URI for AWS ECS Bridge mode!`);
        }
      } catch (error) {
        console.error("❌ Failed to resolve AWS SRV record manually:", error);
        // We log the error but let Mongoose try anyway just in case
      }
    }

    // ---------------------------------------------------------
    // 4. STANDARD CONNECTION LOGIC
    // ---------------------------------------------------------
    // 👈 Use 'activeUri' here instead of 'MONGODB_URI'
    cached.promise = mongoose
      .connect(activeUri, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
