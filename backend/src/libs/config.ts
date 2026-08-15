import mongoose from "mongoose";

export const AUTH_TIMER = 24 * 30;

function requireEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }

  return value;
}

export const MONGO_URL = requireEnv("MONGO_URL");
export const SESSION_SECRET = requireEnv("SESSION_SECRET");

export const shapeIntoMongooseObjectId = (
  target: string | mongoose.Types.ObjectId,
): mongoose.Types.ObjectId => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
