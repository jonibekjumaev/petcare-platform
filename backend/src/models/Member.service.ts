import bcrypt from "bcryptjs";
import MemberModel from "../schema/Member.model";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberInquiry,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus } from "../libs/enums/member.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { AnyRecord } from "../libs/types/common";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      const cleaned = result.toJSON();
      delete cleaned.memberPassword;
      return cleaned;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
      } else {
        console.log("Error: signup", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({
        memberNick: input.memberNick,
        memberStatus: { $ne: MemberStatus.DELETE },
      })
      .select("+memberPassword")
      .lean()
      .exec();

    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    }

    if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword as string,
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    delete member.memberPassword;
    return member;
  }

  public async memberDetail(memberId?: string): Promise<Member> {
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const id = shapeIntoMongooseObjectId(memberId);
    const result = await this.memberModel
      .findOne({ _id: id, memberStatus: MemberStatus.ACTIVE })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    const id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .lean()
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async countMembers(): Promise<number> {
    return this.memberModel
      .countDocuments({ memberStatus: { $ne: MemberStatus.DELETE } })
      .exec();
  }

  public async getAllMembersForAdmin(input: MemberInquiry): Promise<Member[]> {
    const match: AnyRecord = {};
    if (input.memberStatus) match.memberStatus = input.memberStatus;

    const result = await this.memberModel
      .find(match)
      .sort({ createdAt: -1 })
      .skip((input.page - 1) * input.limit)
      .limit(input.limit)
      .lean()
      .exec();

    return result;
  }
}

export default MemberService;
