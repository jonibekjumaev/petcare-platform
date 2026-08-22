import { ChatSessionDTO, ChatMessageDTO } from "@petcare/shared";
import { ChatMessage, ChatSession } from "../types/chat";

export const toChatMessageDTO = (chat: ChatMessage): ChatMessageDTO => ({
  _id: String(chat._id),
  sessionId: String(chat.sessionId),
  messageRole: chat.messageRole,
  messageContent: chat.messageContent,
  createdAt: chat.createdAt.toISOString(),
  updatedAt: chat.updatedAt.toISOString(),
});

export const toChatSessionDTO = (chat: ChatSession): ChatSessionDTO => ({
  _id: String(chat._id),
  memberId: String(chat.memberId),
  petId: String(chat.petId),
  sessionStatus: chat.sessionStatus,
  sessionTitle: chat.sessionTitle,
  createdAt: chat.createdAt.toISOString(),
  updatedAt: chat.updatedAt.toISOString(),
});
