import { TokenPayload } from "./member";

declare global {
  namespace Express {
    interface Request {
      member?: TokenPayload;
    }
  }
}

export {};
