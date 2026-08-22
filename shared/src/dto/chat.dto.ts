import { MessageRole, SessionStatus } from "../enums/chat.enum.js";

/** API javobida qaytadigan suhbat sessiyasi shakli. */
export interface ChatSessionDTO {
  _id: string;
  memberId: string;
  petId: string;
  sessionStatus: SessionStatus;
  sessionTitle: string;
  createdAt: string;
  updatedAt: string;
}

/** API javobida qaytadigan xabar shakli. */
export interface ChatMessageDTO {
  _id: string;
  sessionId: string;
  messageRole: MessageRole;
  messageContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionCreateRequestDTO {
  petId: string;
}

export interface ChatMessageSendRequestDTO {
  sessionId: string;
  messageContent: string;
}
