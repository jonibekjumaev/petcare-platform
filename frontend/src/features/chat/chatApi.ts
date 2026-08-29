import { api } from "../../app/api";
import type {
  ChatSessionDTO,
  ChatMessageDTO,
  ChatSessionCreateRequestDTO,
  ChatMessageSendRequestDTO,
} from "@petcare/shared";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSessions: builder.query<ChatSessionDTO[], void>({
      query: () => "/chat/session/all",
      providesTags: ["Chat"],
    }),
    createSession: builder.mutation<
      ChatSessionDTO,
      ChatSessionCreateRequestDTO
    >({
      query: (input) => ({
        url: "/chat/session/create",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Chat"],
    }),
    getSessionMessages: builder.query<ChatMessageDTO[], string>({
      query: (sessionId) => `/chat/session/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [
        { type: "Chat", id: sessionId },
      ],
    }),
    sendMessage: builder.mutation<ChatMessageDTO, ChatMessageSendRequestDTO>({
      query: (input) => ({
        url: "/chat/message",
        method: "POST",
        body: input,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Chat", id: arg.sessionId },
      ],
    }),
    deleteSession: builder.mutation<ChatSessionDTO, string>({
      query: (id) => ({
        url: "/chat/session/delete",
        method: "POST",
        body: { _id: id },
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetAllSessionsQuery,
  useCreateSessionMutation,
  useGetSessionMessagesQuery,
  useSendMessageMutation,
  useDeleteSessionMutation,
} = chatApi;
