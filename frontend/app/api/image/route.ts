import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile } from 'node:fs/promises';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
  systemInstruction: "You will take a prompt to generate an image, and you will enhance the prompt to make the best image. We are going for a colored drawing cartoon style. Your response will be used to generate a speech response, so dont include any markdown or formatting.",
});

const google = {
  llm: model,
}

export async function POST(req: NextRequest) {
  try {
    let { prompt } = await req.json();
    
    console.log(prompt);

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      },
    });


    prompt = await getChatResponse(prompt);
    console.log(prompt);

    const response = await model.generateContent(prompt);
    const result = response.response.candidates[0].content.parts;

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
      throw new Error('No image was generated');
    }

    const imageBuffer = Buffer.from(imageData, 'base64');
    const imagePath = `public/images/${Date.now()}.png`;
    await writeFile(imagePath, imageBuffer);

    return new Response(JSON.stringify({ 
      image: imagePath,
      description 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in image generation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function getChatResponse(query: string) {
  // Start a chat with history and system prompt
  const chat = google.llm.startChat({
    history: []
  });

  // Send message and get response
  const result = await chat.sendMessage([{ text: query }]);
  return result.response.text();
}
