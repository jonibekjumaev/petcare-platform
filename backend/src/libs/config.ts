import mongoose from "mongoose";

export const AUTH_TIMER = 24 * 30;

export const shapeIntoMongooseObjectId = (
  target: string | mongoose.Types.ObjectId,
): mongoose.Types.ObjectId => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
