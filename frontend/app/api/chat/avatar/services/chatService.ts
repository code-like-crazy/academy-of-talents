import { GoogleGenerativeAI } from "@google/generative-ai";

import { AGENT_SYSTEM_MESSAGES } from "../config/agents";
import { AgentName } from "../types";

// Initialize Google AI
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Create a model for intent detection
const model_intent = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    "You are the presentation assistant and you will get the user prompt. Only return JSON in the following order: {intent: 'intent'}, where you intent is either 'photo' or 'other'. Just sent the JSON, donst start with ```json or ```",
});

/**
 * Service for handling chat-related functionality
 */
export class ChatService {
  /**
   * Get a chat response from the AI model
   * @param query The user's message
   * @param agent_name The agent to use for the response
   * @returns The AI-generated response text
   */
  async getChatResponse(
    query: string,
    agent_name: AgentName = "default",
  ): Promise<string> {
    // Get the appropriate system message for the agent
    const systemInstruction =
      AGENT_SYSTEM_MESSAGES[agent_name] || AGENT_SYSTEM_MESSAGES.default;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        systemInstruction +
        "\n\n" +
        "Your response will be used to generate a speech response. Important rules:\n" +
        "1. No markdown or formatting\n" +
        "2. Keep responses very brief, ideally 1-2 short sentences\n" +
        "3. Be direct and get straight to the point\n" +
        "4. Maximum 20 words per response",
    });

    // Start a chat
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.6, // Reduced for more focused responses
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 100, // Reduced to force shorter responses
      },
    });

    try {
      // Send message and get response
      const result = await chat.sendMessage([{ text: query }]);
      return result.response.text();
    } catch (error) {
      console.error("Error in chat response:", error);
      throw error;
    }
  }

  /**
   * Detect the intent of a user message
   * @param query The user's message
   * @returns The detected intent
   */
  async getIntent(query: string) {
    try {
      const chat = model_intent.startChat({
        history: [],
      });
      const result = await chat.sendMessage(query);
      const text = result.response.text();
      console.log("Raw intent response:", text);

      // Clean up the response text
      let jsonText = text;

      // Remove markdown code block if present
      if (text.startsWith("```json")) {
        jsonText = text.slice(7, -3);
      } else if (text.startsWith("```")) {
        jsonText = text.slice(3, -3);
      }

      // Remove any whitespace and newlines
      jsonText = jsonText.trim();

      // Ensure the response is in the correct format
      if (!jsonText.startsWith("{")) {
        jsonText = `{"intent": "${jsonText}"}`;
      }

      console.log("Cleaned intent json:", jsonText);

      const parsed = JSON.parse(jsonText);
      // Ensure the response has the correct structure
      if (!parsed.intent) {
        return { intent: "other" }; // Default to 'other' if no intent is found
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing intent:", error);
      return { intent: "other" }; // Default to 'other' on error
    }
  }
}

// Export a singleton instance
export const chatService = new ChatService();
