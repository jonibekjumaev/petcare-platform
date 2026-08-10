import { Request, Response, NextFunction } from "express";
import Errors, { HttpCode } from "../libs/Errors";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("Unhandled error:", err);

  if (err instanceof Errors) {
    res.status(err.code).json(err);
    return;
  }

  res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Errors.standard);
};
