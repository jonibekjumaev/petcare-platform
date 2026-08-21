import { MemberDTO } from "@petcare/shared";
import { Member } from "../types/member";

export const toMemberDTO = (member: Member): MemberDTO => ({
  _id: String(member._id),
  memberType: member.memberType,
  memberStatus: member.memberStatus,
  memberNick: member.memberNick,
  memberPhone: member.memberPhone,
  memberImage: member.memberImage,
  memberAddress: member.memberAddress,
  memberPoints: member.memberPoints,
  createdAt: member.createdAt.toISOString(),
  updatedAt: member.updatedAt.toISOString(),
});
