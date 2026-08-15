import "express-session";
import { TokenPayload } from "./member";

declare module "express-session" {
  interface SessionData {
    admin?: TokenPayload;
  }
}
