import { AUTH_TIMER } from "./config";
import jwt from "jsonwebtoken";
import { Member, TokenPayload } from "./types/member";
import Errors, { HttpCode, Message } from "./Errors";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}

const JWT_SECRET: string = rawSecret;

class AuthService {
  private readonly secret: string;

  constructor() {
    this.secret = JWT_SECRET;
  }

  createToken(member: Member): string {
    const payload: TokenPayload = {
      _id: String(member._id),
      memberNick: member.memberNick,
      memberType: member.memberType,
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: `${AUTH_TIMER}h`,
    });
  }

  checkAuth(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (err) {
      console.log("Error: checkAuth", err);
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }
  }
}

export default AuthService;
