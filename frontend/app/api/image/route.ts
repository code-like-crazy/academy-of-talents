import { mkdir, writeFile } from "node:fs/promises";
import { join } from "path";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    "You will enhance image prompts to create high-quality, masterpiece-level artwork. Create vibrant, detailed images in a professional cartoon style with the following characteristics: best quality, masterpiece, highly detailed, sharp focus, vivid colors, smooth lines, perfect composition, artistic, professional lighting, coherent style, polished finish. Maintain a family-friendly aesthetic suitable for all ages. Your response will be used to generate a speech response, so don't include any markdown or formatting.",
});

const google = {
  llm: model,
};

export async function POST(req: NextRequest) {
  try {
    let { prompt } = await req.json();

    console.log(prompt);

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        // @ts-expect-error - responseModalities is valid according to the docs
        responseModalities: ["Text", "Image"],
      },
    });

    prompt = await getChatResponse(prompt);
    console.log(prompt);

    const response = await model.generateContent(prompt);
    // const result = response.response.candidates[0].content.parts;
    const result = response.response.candidates?.[0].content.parts;

    if (!result) {
      throw new Error("No parts found in response");
    }

    let imageData;
    let description;

    for (const part of result) {
      if (part.text) {
        description = part.text;
      } else if (part.inlineData) {
        imageData = part.inlineData.data;
      }
    }

    if (!imageData) {
      throw new Error("No image was generated");
    }

    // Ensure the images directory exists
    const imagesDir = join(process.cwd(), "public", "images");
    try {
      await mkdir(imagesDir, { recursive: true });
    } catch (error) {
      console.error("Error creating images directory:", error);
      throw error;
    }

    const imageBuffer = Buffer.from(imageData, "base64");
    const timestamp = Date.now();
    const imagePath = join(imagesDir, `${timestamp}.png`);
    await writeFile(imagePath, imageBuffer);

    // Return the path without the 'public/' prefix
    return new Response(
      JSON.stringify({
        image: `/images/${timestamp}.png`,
        description,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in image generation:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getChatResponse(query: string) {
  // Start a chat with history and system prompt
  const chat = google.llm.startChat({
    history: [],
  });

  // Send message and get response
  const result = await chat.sendMessage([{ text: query }]);
  return result.response.text();
}
