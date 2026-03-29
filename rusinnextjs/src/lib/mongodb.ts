import mongoose from "mongoose";
import { Resolver } from "dns/promises"; // 👈 1. Import the specific Resolver class

const MONGODB_URI = process.env.MONGODB_URI;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: CachedConnection;
}

let cached: CachedConnection = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (MONGODB_URI === "mongodb://build-time-dummy") {
    console.warn("⚠️ Build time detected. Skipping actual MongoDB connection.");
    return mongoose;
  }

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

    let activeUri = MONGODB_URI;

    // --- UPDATED AWS CLOUD MAP SRV INTERCEPTOR ---
    if (activeUri.startsWith("mongodb+srv://")) {
      try {
        const urlObj = new URL(activeUri);
        const domain = urlObj.hostname;

        console.log(`🔍 Looking up AWS Cloud Map SRV record for: ${domain}`);

        // 2. Explicitly force Node.js to use the AWS Internal DNS Server
        const resolver = new Resolver();
        resolver.setServers(["169.254.169.253"]);

        // 3. Ask AWS for the dynamic EC2 IP and port
        const records = await resolver.resolveSrv(domain);

        if (records && records.length > 0) {
          const { name, port } = records[0];

          activeUri = activeUri
            .replace("mongodb+srv://", "mongodb://")
            .replace(domain, `${name}:${port}`);

          // Safe log that hides your password but proves it worked
          console.log(`✅ Successfully rebuilt URI to target: ${name}:${port}`);
        }
      } catch (error) {
        // 4. STOP if this fails. Do NOT let Mongoose try the broken +srv string.
        console.error("❌ Failed to resolve AWS SRV record manually:", error);
        throw new Error(
          "DNS Resolution for AWS Cloud Map failed. Halting connection.",
        );
      }
    }
    // ---------------------------------------------

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
