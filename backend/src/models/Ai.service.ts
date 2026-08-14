import Anthropic from "@anthropic-ai/sdk";
import Errors, { HttpCode, Message } from "../libs/Errors";

const rawKey = process.env.ANTHROPIC_API_KEY;
if (!rawKey) {
  console.error("ANTHROPIC_API_KEY is missing in .env");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: rawKey });

class AIService {
  public async getResponse(
    systemPrompt: string,
    contextText: string,
    history: { role: "user" | "assistant"; content: string }[],
    newMessage: string,
  ): Promise<string> {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: `${systemPrompt}\n\n${contextText}`,
        messages: [...history, { role: "user", content: newMessage }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      return textBlock?.type === "text" ? textBlock.text : "";
    } catch (err) {
      console.error("Error, AIService: getResponse:", err);
      throw new Errors(
        HttpCode.INTERNAL_SERVER_ERROR,
        Message.SOMETHING_WENT_WRONG,
      );
    }
  }
}

export default AIService;
