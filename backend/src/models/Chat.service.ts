import { shapeIntoMongooseObjectId } from "../libs/config";
import { MessageRole } from "../libs/enums/chat.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ChatMessage, ChatSession } from "../libs/types/chat";
import { Order } from "../libs/types/order";
import { Pet } from "../libs/types/pet";
import ChatMessageModel from "../schema/ChatMessage.model";
import ChatSessionModel from "../schema/ChatSession.model";
import OrderModel from "../schema/Order.model";
import PetModel from "../schema/Pet.model";
import AIService from "./Ai.service";

class ChatService {
  private readonly chatSessionModel;
  private readonly petModel;
  private readonly chatMessageModel;
  private readonly orderModel;
  private readonly aiService;

  constructor() {
    this.chatSessionModel = ChatSessionModel;
    this.petModel = PetModel;
    this.chatMessageModel = ChatMessageModel;
    this.orderModel = OrderModel;
    this.aiService = new AIService();
  }

  public async createSession(
    memberId: string,
    petId: string,
  ): Promise<ChatSession> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    const petObjectId = shapeIntoMongooseObjectId(petId);

    const pet = await this.petModel
      .findOne({ _id: petObjectId, memberId: memberObjectId })
      .exec();

    if (!pet) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const sessionTitle = `${pet.petName} haqida`;

    try {
      const newSession = await this.chatSessionModel.create({
        memberId: memberObjectId,
        petId: petObjectId,
        sessionTitle,
      });

      return newSession;
    } catch (err) {
      console.error("Error, model: createSession:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getAllSessions(memberId: string): Promise<ChatSession[]> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);

    const result = await this.chatSessionModel
      .find({ memberId: memberObjectId })
      .sort({ createdAt: -1 })
      .exec();

    return result;
  }

  public async deleteSession(
    memberId: string,
    sessionId: string,
  ): Promise<ChatSession> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    const sessionObjectId = shapeIntoMongooseObjectId(sessionId);

    const session = await this.chatSessionModel
      .findOneAndDelete({ _id: sessionObjectId, memberId: memberObjectId })
      .exec();

    if (!session) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    // No soft-delete status for chat: a conversation carries no other data
    // that anything downstream needs to keep around, so its messages go with
    // it rather than sitting orphaned in the collection.
    await this.chatMessageModel
      .deleteMany({ sessionId: sessionObjectId })
      .exec();

    return session;
  }

  public async getSessionMessages(
    memberId: string,
    sessionId: string,
  ): Promise<ChatMessage[]> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    const sessionObjectId = shapeIntoMongooseObjectId(sessionId);

    const session = await this.chatSessionModel
      .findOne({ _id: sessionObjectId, memberId: memberObjectId })
      .exec();

    if (!session) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const messages = await this.chatMessageModel
      .find({ sessionId: sessionObjectId })
      .sort({ createdAt: 1 })
      .exec();

    return messages;
  }

  public async sendMessage(
    memberId: string,
    sessionId: string,
    messageContent: string,
  ): Promise<ChatMessage> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    const sessionObjectId = shapeIntoMongooseObjectId(sessionId);

    // a) Confirm the session belongs to this member
    const session = await this.chatSessionModel
      .findOne({ _id: sessionObjectId, memberId: memberObjectId })
      .exec();

    if (!session) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    // b) Load the pet profile
    const pet = await this.petModel.findById(session.petId).exec();
    if (!pet) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    // c) Load the last 5 orders for this pet
    const recentOrders = await this.orderModel
      .find({ petId: session.petId })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    // d) Load prior messages and map them into Claude's format
    const priorMessages = await this.chatMessageModel
      .find({ sessionId: sessionObjectId })
      .sort({ createdAt: 1 })
      .exec();

    const history = priorMessages.map((msg) => ({
      role:
        msg.messageRole === MessageRole.USER
          ? ("user" as const)
          : ("assistant" as const),
      content: msg.messageContent,
    }));

    // e) Build the context text and system prompt
    const contextText = this.buildContextText(pet, recentOrders);
    const systemPrompt =
      "You are a pet care assistant. Use the customer's pet profile and order history to give specific, personalized advice. Always reply in the same language the customer writes in.";

    // f) Call Claude
    const aiReply = await this.aiService.getResponse(
      systemPrompt,
      contextText,
      history,
      messageContent,
    );

    // g) Save both messages
    await this.chatMessageModel.create({
      sessionId: sessionObjectId,
      messageRole: MessageRole.USER,
      messageContent,
    });

    const assistantMessage = await this.chatMessageModel.create({
      sessionId: sessionObjectId,
      messageRole: MessageRole.ASSISTANT,
      messageContent: aiReply,
    });

    // h) Return the AI's reply
    return assistantMessage;
  }

  private buildContextText(pet: Pet, orders: Order[]): string {
    const petInfo = [
      `Name: ${pet.petName}`,
      `Type: ${pet.petType}`,
      `Breed: ${pet.petBreed ?? "unknown"}`,
      `Age: ${pet.petAgeMonths ?? "unknown"} months`,
      `Weight: ${pet.petWeight ?? "unknown"} kg`,
      `Notes: ${pet.petNotes ?? "none"}`,
    ].join("\n");

    const ordersInfo = orders.length
      ? orders
          .map((o) => `- ${o.orderTotal}, status: ${o.orderStatus}`)
          .join("\n")
      : "No orders yet";

    return `Here is the customer's pet profile:\n${petInfo}\n\nRecent orders:\n${ordersInfo}`;
  }
}

export default ChatService;
