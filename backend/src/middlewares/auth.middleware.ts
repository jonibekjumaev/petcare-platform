import { Request, Response, NextFunction } from "express";
import AuthService from "../libs/AuthService";
import Errors, { HttpCode, Message } from "../libs/Errors";

const authService = new AuthService();

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
  }

  const token = authHeader.split(" ")[1];
  req.member = authService.checkAuth(token);
  next();
};
