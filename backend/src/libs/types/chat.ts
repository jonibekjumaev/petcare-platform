import { ObjectId } from "mongoose";
import { MessageRole, SessionStatus } from "../enums/chat.enum";

export interface ChatSession {
  _id: ObjectId;
  memberId: ObjectId;
  petId: ObjectId;
  sessionStatus: SessionStatus;
  sessionTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id: ObjectId;
  sessionId: ObjectId;
  messageRole: MessageRole;
  messageContent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSessionInput {
  petId: string;
}

export interface ChatMessageInput {
  sessionId: string;
  messageContent: string;
}
