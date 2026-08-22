import { MemberStatus, MemberType } from "../enums/member.enum.js";

/**
 * API javobida qaytadigan a'zo shakli.
 */
export interface MemberDTO {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberImage?: string;
  memberAddress?: string;
  memberPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequestDTO {
  memberNick: string;
  memberPassword: string;
}

export interface SignupRequestDTO {
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
}

/** POST /member/login va /member/signup javobi. */
export interface AuthResponseDTO {
  member: MemberDTO;
  accessToken: string;
}

export interface MemberUpdateRequestDTO {
  memberNick?: string;
  memberPhone?: string;
  memberAddress?: string;
  memberImage?: string;
}
