import { NextRequest } from "next/server";

import { AVATAR_ID_TO_AGENT_NAME } from "./config/agents";
import {
  avatarService,
  chatService,
  lipSyncService,
  speechService,
} from "./services";
import { AgentName, ChatRequest, ChatResponse } from "./types";

// Check for required environment variables
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined");
}

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY is not defined");
}

/**
 * POST handler for the avatar chat endpoint
 * Processes chat requests and returns responses with audio, lip sync, and animation data
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { message, agent_name = "default" } =
      (await req.json()) as ChatRequest;

    // Validate the request
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert avatar ID to agent name if needed
    const agentName =
      AVATAR_ID_TO_AGENT_NAME[agent_name] || (agent_name as AgentName);

    // Get chat response from Gemini
    let response = await chatService.getChatResponse(message, agentName);

    // Generate audio from text
    const audioFile = await speechService.getSpeechResponse(
      response,
      agentName,
    );
    const audioBase64 = await speechService.convertAudioToBase64(audioFile);

    // Generate lip sync data
    console.log("About to generate lip sync data for audio file:", audioFile);
    const lipSyncData = await lipSyncService.generateLipSync(audioFile);
    console.log(
      "Lip sync data generated:",
      JSON.stringify(lipSyncData).substring(0, 200) + "...",
    );

    // Determine facial expression and animation
    const expressionData =
      avatarService.determineExpressionAndAnimation(agentName);

    // Check if this is an image generation request
    let imageUrl;
    if (agent_name === "aria") {
      try {
        // Use intent detection to determine if this is an image request
        const intent = await chatService.getIntent(message);
        console.log("Intent detection result:", intent);

        if (intent.intent === "photo") {
          console.log("Image generation intent detected");

          // Call the image generation API
          const imageResponse = await fetch(`${req.nextUrl.origin}/api/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: message }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log("Image generation response:", imageData);

            // Make sure the image URL is properly formatted
            if (imageData.image) {
              // If the URL doesn't start with a slash, add one
              imageUrl = imageData.image.startsWith("/")
                ? imageData.image
                : `/${imageData.image}`;

              console.log("Setting image URL:", imageUrl);

              // Update the response text to acknowledge the image generation
              response = `I've created an image based on your request. Here it is!`;
            } else {
              console.error("No image URL in response:", imageData);
            }
          }
        }
      } catch (error) {
        console.error("Error in image generation process:", error);
      }
    }

    // Prepare the response data
    const responseData: ChatResponse = {
      text: response,
      audio: audioBase64,
      lipsync: lipSyncData,
      facialExpression: expressionData.expression,
      animation: expressionData.animation,
      image: imageUrl,
    };

    console.log(
      "Sending response with lip sync data:",
      JSON.stringify({
        text: response.substring(0, 30) + "...",
        audioLength: audioBase64 ? audioBase64.length : 0,
        lipsync: {
          metadata: lipSyncData.metadata,
          mouthCuesCount: lipSyncData.mouthCues
            ? lipSyncData.mouthCues.length
            : 0,
          firstFewCues: lipSyncData.mouthCues
            ? lipSyncData.mouthCues.slice(0, 3)
            : [],
        },
      }),
    );

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in avatar chat endpoint:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
