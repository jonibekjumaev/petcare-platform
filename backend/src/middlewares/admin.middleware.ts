import { Request, Response, NextFunction } from "express";
import { MemberType } from "../libs/enums/member.enum";

export const verifyAdminSession = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const admin = req.session.admin;

  if (!admin || admin.memberType !== MemberType.ADMIN) {
    res.redirect("/admin");
    return;
  }

  next();
};
