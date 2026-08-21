import { Request, Response } from "express";
import AuthService from "../libs/AuthService";
import Errors, { HttpCode } from "../libs/Errors";
import MemberService from "../models/Member.service";
import { toMemberDTO } from "../libs/mappers/member.mapper";
import {
  ExtendedRequest,
  LoginInput,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";

const memberService = new MemberService();
const authService = new AuthService();

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: MemberInput = req.body;
    const member = await memberService.signup(input);
    const accessToken = authService.createToken(member);

    res
      .status(HttpCode.CREATED)
      .json({ member: toMemberDTO(member), accessToken });
  } catch (err) {
    console.log("Error: signup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: LoginInput = req.body;
    const member = await memberService.login(input);
    const accessToken = authService.createToken(member);

    res.status(HttpCode.OK).json({ member: toMemberDTO(member), accessToken });
  } catch (err) {
    console.log("Error: login", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const memberDetail = async (req: ExtendedRequest, res: Response) => {
  try {
    const member = await memberService.memberDetail(req.member?._id);

    res.status(HttpCode.OK).json(toMemberDTO(member));
  } catch (err) {
    console.log("Error: memberDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const updateMember = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const input: MemberUpdateInput = req.body;
    input._id = req.member!._id;
    const result = await memberService.updateMember(input);

    res.status(HttpCode.OK).json(toMemberDTO(result));
  } catch (err) {
    console.log("Error: updateMember", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
