/* eslint-disable */
// @ts-nocheck

import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, readFile } from 'node:fs/promises';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
  systemInstruction: "You are a helpful assistant that can answer questions and help with tasks. Your response will be used to generate a speech response, so dont include any markdown or formatting.",
});


const model_intent = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
  systemInstruction: "You are the presentation assistant and you will get the user prompt. Only return JSON in the following order: {intent: 'intent'}, where you intent is either 'photo' or 'other'.",
});

const google = {
  llm: model,
  llm_intent: model_intent,
}


export async function POST(req: NextRequest) {
  try {
    const { query, history, assistant = [] } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const intent = await getIntent(query);
    console.log(intent);
    if (intent.intent === 'photo') {
      const image = await getImage(query);
      console.log("image");
      return new Response(JSON.stringify({ 
        text: "Image",
        image: image,
        audio: ""
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const response = await getChatResponse(query, history);
      console.log(response);

      const audioFile = await getSpeechResponse(response);
      const audioBase64 = await convertAudioToBase64(audioFile);

      return new Response(JSON.stringify({ 
        text: response,
        audio: audioBase64,
        image: ""
      }), {
        headers: { 'Content-Type': 'application/json' },
      });

    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function getChatResponse(query: string, history: any[] = []) {
  // Format history into chat messages
  const chatHistory = history.map((msg: any) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Start a chat with history and system prompt
  const chat = google.llm.startChat({
    history: [...chatHistory]
  });

  // Send message and get response
  const result = await chat.sendMessage([{ text: query }]);
  return result.response.text();
}

function getSystemPrompt(assistant: AssistantTypes) {
  
}

async function getSpeechResponse(text: string) {
  try {
    const response = await fetch(process.env.SYNTHESIS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());
    
    // Save audio file temporarily
    const outputFile = 'temp_output.mp3';
    await writeFile(outputFile, audioBuffer);

    return outputFile;

  } catch (error) {
    console.error('Error in speech synthesis:', error);
    throw error;
  }
}

async function getIntent(query: string) {
  const chat = google.llm_intent.startChat({
    history: []
  });
  console.log("sending intent");
  const result = await chat.sendMessage([{ text: query }]);
  console.log("got intent");
  const text = result.response.text();
  console.log("text", text);
  const jsonText = text.startsWith('```json') ? text.slice(7, -3) : text;
  return JSON.parse(jsonText);
}

async function getImage(query: string) {
  const response = await fetch('http://localhost:3000/api/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: query })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const body = await response.json();
  // Remove the 'public/' prefix from the path
  return body.image.replace('public/', '');
}


async function convertAudioToBase64(filePath: string): Promise<string> {
  const audioBuffer = await readFile(filePath);
  return audioBuffer.toString('base64');
}
