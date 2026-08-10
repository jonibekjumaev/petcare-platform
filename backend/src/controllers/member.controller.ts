import { Request, Response } from "express";
import AuthService from "../libs/AuthService";
import Errors, { HttpCode } from "../libs/Errors";
import MemberService from "../models/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";

const memberService = new MemberService();
const authService = new AuthService();

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("signup");
    const input: MemberInput = req.body;
    const member = await memberService.signup(input);
    const accessToken = authService.createToken(member);

    res.status(HttpCode.CREATED).json({ member, accessToken });
  } catch (err) {
    console.log("Error: signup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("login");
    const input: LoginInput = req.body;
    const member = await memberService.login(input);
    const accessToken = authService.createToken(member);

    res.status(HttpCode.OK).json({ member, accessToken });
  } catch (err) {
    console.log("Error: login", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
