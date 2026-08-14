import { Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ExtendedRequest } from "../libs/types/member";
import { ChatSessionInput, ChatMessageInput } from "../libs/types/chat";
import ChatService from "../models/Chat.service";

const chatService = new ChatService();

export const createSession = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const input: ChatSessionInput = req.body;
    const result = await chatService.createSession(memberId, input.petId);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error: createSession", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getAllSessions = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const result = await chatService.getAllSessions(memberId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error: getAllSessions", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getSessionMessages = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const sessionId = req.params.id as string;
    const result = await chatService.getSessionMessages(memberId, sessionId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error: getSessionMessages", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const sendMessage = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const input: ChatMessageInput = req.body;
    const result = await chatService.sendMessage(
      memberId,
      input.sessionId,
      input.messageContent,
    );

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error: sendMessage", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
