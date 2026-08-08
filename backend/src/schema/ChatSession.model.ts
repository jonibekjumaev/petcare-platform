import mongoose, { Schema } from "mongoose";
import { ChatSession } from "../libs/types/chat";
import { SessionStatus } from "../libs/enums/chat.enum";

const ChatSessionSchema = new Schema<ChatSession>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },

    sessionStatus: {
      type: String,
      enum: SessionStatus,
      default: SessionStatus.ACTIVE,
    },

    sessionTitle: {
      type: String,
      required: true,
    },
  },

  { timestamps: true },
);

ChatSessionSchema.index({ memberId: 1, createdAt: -1 });

export default mongoose.model("ChatSession", ChatSessionSchema);
