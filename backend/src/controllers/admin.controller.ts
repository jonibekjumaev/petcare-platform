import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import { LoginInput } from "../libs/types/member";

const memberService = new MemberService();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: LoginInput = req.body;
    const member = await memberService.login(input);

    if (member.memberType !== MemberType.ADMIN) {
      throw new Errors(HttpCode.FORBIDDEN, Message.NOT_AUTHENTICATED);
    }

    req.session.admin = {
      _id: member._id.toString(),
      memberNick: member.memberNick,
      memberType: member.memberType,
    };

    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, login:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;

    res.render("login", { error: message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error, logout:", err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/admin");
  });
};
