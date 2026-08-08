import mongoose, { Schema } from "mongoose";
import { ChatMessage } from "../libs/types/chat";
import { MessageRole } from "../libs/enums/chat.enum";

const ChatMessageSchema = new Schema<ChatMessage>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },

    messageRole: {
      type: String,
      enum: MessageRole,
      required: true,
    },

    messageContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", ChatMessageSchema);
