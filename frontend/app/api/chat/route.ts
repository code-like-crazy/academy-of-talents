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

const google = {
  llm: model,
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

    const response = await getChatResponse(query, history);
    console.log(response);

    const audioFile = await getSpeechResponse(response);
    const audioBase64 = await convertAudioToBase64(audioFile);

    return new Response(JSON.stringify({ 
      text: response,
      audio: audioBase64 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
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
    const response = await fetch('https://c2d5-138-51-79-81.ngrok-free.app/synthesize', {
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

async function convertAudioToBase64(filePath: string): Promise<string> {
  const audioBuffer = await readFile(filePath);
  return audioBuffer.toString('base64');
}
