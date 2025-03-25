import { readFile, writeFile } from "node:fs/promises";
import path from "path";

import { AVATAR_VOICE_IDS } from "../config/agents";
import { AgentName } from "../types";

// Initialize ElevenLabs API
if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY is not defined");
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * Service for handling speech synthesis
 */
export class SpeechService {
  /**
   * Generate speech from text using ElevenLabs API
   * @param text The text to convert to speech
   * @param agent_name The agent to use for voice selection
   * @returns Path to the generated audio file
   */
  async getSpeechResponse(
    text: string,
    agent_name: AgentName,
  ): Promise<string> {
    try {
      // Get the appropriate voice ID for the agent
      const voiceId = AVATAR_VOICE_IDS[agent_name] || AVATAR_VOICE_IDS.default;

      console.log(
        `Generating speech for ${agent_name} using voice ID: ${voiceId}`,
      );

      // Create a unique filename based on timestamp
      const timestamp = Date.now();
      const outputFile = path.join(
        process.cwd(),
        `temp_output_${timestamp}.mp3`,
      );

      try {
        // Call ElevenLabs API for text-to-speech using fetch
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: text,
              model_id: "eleven_monolingual_v1",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `ElevenLabs API error: ${response.status} - ${errorText}`,
          );
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        // Get the audio data as an ArrayBuffer
        const audioArrayBuffer = await response.arrayBuffer();

        // Save the audio file
        await writeFile(outputFile, Buffer.from(audioArrayBuffer));
        console.log(`Speech generated successfully and saved to ${outputFile}`);

        return outputFile;
      } catch (apiError: any) {
        console.error("Error calling ElevenLabs API:", apiError.message);
        // Fall through to fallback
      }

      // Fallback: Use a static audio file if available, or create an empty one
      console.log("Using fallback audio file");
      const fallbackFile = path.join(
        process.cwd(),
        "public",
        "sounds",
        "075176_duck-quack-40345.mp3",
      );

      // Copy the fallback file to our temp output location
      try {
        const fallbackBuffer = await readFile(fallbackFile);
        await writeFile(outputFile, fallbackBuffer);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          // If even the fallback file isn't available, create an empty MP3 file
          console.warn(
            "Fallback audio file not available, creating empty file",
          );
          const emptyMp3 = Buffer.from([
            0xff, 0xfb, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00,
          ]);
          await writeFile(outputFile, emptyMp3);
        }
      }

      return outputFile;
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      throw error;
    }
  }

  /**
   * Convert an audio file to base64 encoding
   * @param filePath Path to the audio file
   * @returns Base64-encoded audio data
   */
  async convertAudioToBase64(filePath: string): Promise<string> {
    try {
      const audioBuffer = await readFile(filePath);
      return audioBuffer.toString("base64");
    } catch (error) {
      console.error("Error converting audio to base64:", error);
      return "";
    }
  }
}

// Export a singleton instance
export const speechService = new SpeechService();
