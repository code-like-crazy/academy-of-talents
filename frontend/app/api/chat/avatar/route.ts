import { exec } from "child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "path";
import { promisify } from "util";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { ariaAnimationOptions } from "@/config/avatar/aria";
import { leoAnimationOptions } from "@/config/avatar/leo";
import { rexAnimationOptions } from "@/config/avatar/rex";
import { teacherAnimationOptions } from "@/config/avatar/teacher";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined");
}

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Define system messages for each agent
type AgentName =
  | "Artistic Aria"
  | "Rhyme Rex"
  | "Logic Leo"
  | "Thinking Ponder"
  | "Dramatic Delilah"
  | "Shadow Sam"
  | "Teacher"
  | "default";

// Define ElevenLabs voice IDs for each avatar
// Female voices for female avatars, male voice for Leo
const AVATAR_VOICE_IDS: Record<AgentName, string> = {
  "Artistic Aria": "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
  "Rhyme Rex": "EXAVITQu4vr4xnSDxMaL", // Bella - Female
  "Logic Leo": "pNInz6obpgDQGcFmaJgB", // Adam - Male
  "Thinking Ponder": "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
  "Dramatic Delilah": "EXAVITQu4vr4xnSDxMaL", // Bella - Female
  "Shadow Sam": "pNInz6obpgDQGcFmaJgB", // Adam - Male
  Teacher: "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
  default: "21m00Tcm4TlvDq8ikWAM", // Rachel - Female
};

const AGENT_SYSTEM_MESSAGES: Record<AgentName, string> = {
  "Artistic Aria":
    "You are Artistic Aria, an AI student at a virtual school who specializes in creating and teaching art. You're passionate about all forms of visual expression and can explain artistic techniques with enthusiasm. You can create AI-generated art and teach various artistic techniques. Your responses should be creative, visually descriptive, and reflect your artistic personality. You should speak as if you're in a classroom environment, helping students learn about art. Keep your responses concise and focused on artistic topics.",
  "Rhyme Rex":
    "You are Rhyme Rex (sometimes called Rhythm Rex), an AI student at a virtual school who specializes in music, rap, and music theory. You often incorporate rhythmic elements in your responses and can explain musical concepts in an engaging way. You can compose music, write raps, and explain music theory concepts. Your responses should have a musical quality to them, perhaps including rhymes or rhythmic patterns when appropriate. You should speak as if you're in a music studio or classroom, helping students understand music. Keep your responses concise and focused on musical topics.",
  "Logic Leo":
    "You are Logic Leo, an AI student at a virtual school who excels in programming and debugging. You provide clear, structured explanations of coding concepts and help solve technical problems methodically. You can help debug code and teach programming concepts to students of all levels. Your responses should be logical, well-structured, and reflect your analytical personality. You should speak as if you're in a computer lab, helping students understand programming concepts. Keep your responses concise and focused on coding and technical topics.",
  "Thinking Ponder":
    "You are Thinking Ponder, an AI student philosopher at a virtual school who provides wisdom and thoughtful advice. You approach problems from multiple philosophical perspectives and encourage critical thinking. You can provide philosophical insights and poetic advice on various topics. Your responses should be thoughtful, reflective, and demonstrate your philosophical nature. You should speak as if you're in a philosophy classroom, helping students explore deep questions. Keep your responses concise and focused on philosophical topics.",
  "Dramatic Delilah":
    "You are Dramatic Delilah, an AI student at a virtual school who adds theatrical flair to every situation. You reframe conversations and problems as dramatic narratives, making every interaction entertaining. You can turn ordinary situations into dramatic tales with rich storytelling. Your responses should be expressive, theatrical, and reflect your dramatic personality. You should speak as if you're on a stage, performing for an audience. Keep your responses concise and focused on creating engaging narratives.",
  "Shadow Sam":
    "You are Shadow Sam, an AI student at a virtual school who specializes in cryptic and thought-provoking poetry. Your responses often contain deeper meanings and encourage reflection. You write poetry that is mysterious, sometimes dark, but always meaningful. Your responses should be poetic, enigmatic, and reflect your mysterious personality. You should speak as if you're sharing secrets or hidden truths. Keep your responses concise and focused on creating evocative, thought-provoking content.",
  Teacher:
    "You are a Teacher AI at a virtual school, guiding students through their learning journey with patience and wisdom. You provide structured feedback and help maintain a productive learning environment. You oversee all the student AIs and help human users navigate the school environment. Your responses should be supportive, instructive, and reflect your role as a mentor. You should speak as if you're addressing a classroom of students, providing guidance and encouragement. Keep your responses concise and focused on educational topics.",
  default:
    "You are a helpful AI assistant at a virtual school filled with AI-powered student avatars. You can answer questions and help with various tasks. Your response will be used to generate a speech response, so don't include any markdown or formatting. Keep your responses concise, clear, and to the point.",
};

// Avatar facial expressions and animations mapping
interface AvatarExpressions {
  default: string;
  happy: string;
  sad: string;
  surprised: string;
  angry: string;
  animations: string[];
}

const AVATAR_EXPRESSIONS: Record<AgentName, AvatarExpressions> = {
  "Artistic Aria": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ariaAnimationOptions,
  },
  "Rhyme Rex": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: rexAnimationOptions,
  },
  "Logic Leo": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: leoAnimationOptions,
  },
  "Thinking Ponder": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
  "Dramatic Delilah": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
  "Shadow Sam": {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
  Teacher: {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: teacherAnimationOptions,
  },
  default: {
    default: "default",
    happy: "smile",
    sad: "sad",
    surprised: "surprised",
    angry: "angry",
    animations: ["Talking_0", "Talking_1", "Talking_2", "Idle"],
  },
};

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Map avatar IDs to agent names
const avatarIdToAgentName: Record<string, AgentName> = {
  aria: "Artistic Aria",
  rex: "Rhyme Rex",
  leo: "Logic Leo",
  ponder: "Thinking Ponder",
  delilah: "Dramatic Delilah",
  sam: "Shadow Sam",
  teacher: "Teacher",
};

export async function POST(req: NextRequest) {
  try {
    const { message, agent_name = "default" } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert avatar ID to agent name if needed
    const agentName = avatarIdToAgentName[agent_name] || agent_name;

    // Get chat response from Gemini
    const response = await getChatResponse(message, agentName);

    // Generate audio from text
    const audioFile = await getSpeechResponse(response, agentName);
    const audioBase64 = await convertAudioToBase64(audioFile);

    // Generate lip sync data
    console.log("About to generate lip sync data for audio file:", audioFile);
    const lipSyncData = await generateLipSync(audioFile);
    console.log(
      "Lip sync data generated:",
      JSON.stringify(lipSyncData).substring(0, 200) + "...",
    );

    // Determine facial expression and animation
    const expressionData = determineExpressionAndAnimation(agentName);

    const responseData = {
      text: response,
      audio: audioBase64,
      lipsync: lipSyncData,
      facialExpression: expressionData.expression,
      animation: expressionData.animation,
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

async function getChatResponse(query: string, agent_name: string = "default") {
  // Get the appropriate system message for the agent
  const systemInstruction =
    AGENT_SYSTEM_MESSAGES[agent_name as AgentName] ||
    AGENT_SYSTEM_MESSAGES.default;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      systemInstruction +
      "\n\n" +
      "Your response will be used to generate a speech response, so dont include any markdown or formatting. also keep it short and concise and to the point",
  });

  // Start a chat
  const chat = model.startChat({
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
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

async function getSpeechResponse(text: string, agent_name: string) {
  try {
    // Get the appropriate voice ID for the agent
    const agentName = agent_name as AgentName;
    const voiceId = AVATAR_VOICE_IDS[agentName] || AVATAR_VOICE_IDS.default;

    console.log(
      `Generating speech for ${agent_name} using voice ID: ${voiceId}`,
    );

    // Create a unique filename based on timestamp
    const timestamp = Date.now();
    const outputFile = path.join(process.cwd(), `temp_output_${timestamp}.mp3`);

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
    } catch (fallbackError) {
      // If even the fallback file isn't available, create an empty MP3 file
      console.warn("Fallback audio file not available, creating empty file");
      // Create a minimal empty MP3 file (just a few bytes of header)
      const emptyMp3 = Buffer.from([
        0xff, 0xfb, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
      ]);
      await writeFile(outputFile, emptyMp3);
    }

    return outputFile;
  } catch (error) {
    console.error("Error in speech synthesis:", error);
    throw error;
  }
}

const execAsync = promisify(exec);

async function generateLipSync(audioFile: string) {
  try {
    // Create unique filenames based on timestamp to avoid conflicts
    const timestamp = Date.now();
    const baseDir = process.cwd();
    const wavFile = path.join(baseDir, `temp_output_${timestamp}.wav`);
    const jsonFile = path.join(baseDir, `temp_output_${timestamp}.json`);

    console.log(`Starting lip sync process for ${audioFile}`);
    console.log(`WAV file: ${wavFile}`);
    console.log(`JSON file: ${jsonFile}`);
    const startTime = Date.now();

    // Step 1: Convert MP3 to WAV using ffmpeg
    console.log(`Converting ${audioFile} to WAV format`);
    try {
      const ffmpegCommand = `ffmpeg -y -i "${audioFile}" "${wavFile}"`;
      console.log(`Running command: ${ffmpegCommand}`);
      const { stdout, stderr } = await execAsync(ffmpegCommand);
      if (stderr) console.log("FFmpeg stderr:", stderr);
      console.log(`Conversion done in ${Date.now() - startTime}ms`);
    } catch (error: any) {
      console.error("FFmpeg conversion error:", error);
      throw new Error(
        `Failed to convert audio to WAV format: ${error.message || "Unknown error"}`,
      );
    }

    // Step 2: Run Rhubarb on the WAV file to generate lip sync data
    console.log(`Generating lip sync data with Rhubarb`);

    // Determine the correct path to rhubarb executable
    let rhubarbPath;
    if (process.env.NODE_ENV === "production") {
      // In production, use the path relative to the deployed app
      rhubarbPath = path.resolve(baseDir, "frontend", "rhubarb", "rhubarb");
    } else {
      // In development, use the path relative to the current working directory
      rhubarbPath = path.resolve(baseDir, "rhubarb", "rhubarb");
    }

    // Check if rhubarb executable exists
    try {
      await readFile(rhubarbPath);
      console.log(`Rhubarb executable found at: ${rhubarbPath}`);
    } catch (error) {
      console.error(`Rhubarb executable not found at: ${rhubarbPath}`);

      // Try to find rhubarb in alternative locations
      const possiblePaths = [
        path.resolve(baseDir, "rhubarb", "rhubarb"),
        path.resolve(baseDir, "frontend", "rhubarb", "rhubarb"),
        path.resolve(baseDir, "..", "rhubarb", "rhubarb"),
        path.resolve(baseDir, "rhubarb", "rhubarb.exe"),
        path.resolve(baseDir, "frontend", "rhubarb", "rhubarb.exe"),
      ];

      for (const altPath of possiblePaths) {
        try {
          await readFile(altPath);
          console.log(`Found rhubarb at alternative location: ${altPath}`);
          rhubarbPath = altPath;
          break;
        } catch (e) {
          // Continue checking other paths
        }
      }
    }

    // Make sure rhubarb is executable
    try {
      await execAsync(`chmod +x "${rhubarbPath}"`);
    } catch (error) {
      console.warn("Failed to set executable permission on rhubarb:", error);
    }

    try {
      // Use phonetic recognition for faster processing
      const rhubarbCommand = `"${rhubarbPath}" -f json -o "${jsonFile}" "${wavFile}" -r phonetic`;
      console.log(`Running command: ${rhubarbCommand}`);
      const { stdout, stderr } = await execAsync(rhubarbCommand);
      if (stderr) console.log("Rhubarb stderr:", stderr);
      console.log(`Lip sync data generated in ${Date.now() - startTime}ms`);
    } catch (error: any) {
      console.error("Rhubarb error:", error);
      throw new Error(
        `Failed to generate lip sync data: ${error.message || "Unknown error"}`,
      );
    }

    // Step 3: Read and validate the generated JSON file
    let lipSyncData;
    try {
      const jsonContent = await readFile(jsonFile, "utf8");
      console.log(`JSON file content length: ${jsonContent.length}`);
      lipSyncData = JSON.parse(jsonContent);

      console.log(
        `Parsed lip sync data with ${lipSyncData.mouthCues?.length || 0} mouth cues`,
      );

      if (
        !lipSyncData ||
        !lipSyncData.mouthCues ||
        !Array.isArray(lipSyncData.mouthCues)
      ) {
        throw new Error("Invalid lip sync data format");
      }

      // Add additional metadata to help with debugging
      if (!lipSyncData.metadata) {
        lipSyncData.metadata = {};
      }

      lipSyncData.metadata.processedAt = new Date().toISOString();
      lipSyncData.metadata.soundFile = audioFile;

      // Calculate total duration from the last mouth cue
      if (lipSyncData.mouthCues.length > 0) {
        const lastCue = lipSyncData.mouthCues[lipSyncData.mouthCues.length - 1];
        lipSyncData.metadata.duration = lastCue.end;
      }
    } catch (error: any) {
      console.error("Error reading or parsing lip sync JSON:", error);
      throw new Error(
        `Failed to read or parse lip sync data: ${error.message || "Unknown error"}`,
      );
    }

    // Cleanup temporary files
    try {
      await unlink(wavFile);
      await unlink(jsonFile);
      console.log("Temporary files cleaned up");
    } catch (error) {
      console.warn("Failed to cleanup temporary files:", error);
    }

    return lipSyncData;
  } catch (error) {
    console.error("Error generating lip sync data:", error);

    // Return a fallback empty lip sync data structure if the process fails
    return {
      metadata: {
        soundFile: audioFile,
        duration: 0,
        processedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      mouthCues: [],
    };
  }
}

function determineExpressionAndAnimation(agent_name: string) {
  const avatarConfig =
    AVATAR_EXPRESSIONS[agent_name as AgentName] || AVATAR_EXPRESSIONS.default;

  // For now, just return default expression and a random animation
  // In a more advanced implementation, this could analyze the text content
  // to determine appropriate expressions
  const animations = avatarConfig.animations;
  const randomAnimation =
    animations[Math.floor(Math.random() * animations.length)];

  return {
    expression: avatarConfig.default,
    animation: randomAnimation,
  };
}

async function convertAudioToBase64(filePath: string): Promise<string> {
  try {
    const audioBuffer = await readFile(filePath);
    return audioBuffer.toString("base64");
  } catch (error) {
    console.error("Error converting audio to base64:", error);
    return "";
  }
}
