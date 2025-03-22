/* eslint-disable */
// @ts-nocheck

import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { writeFile } from 'node:fs/promises';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
  systemInstruction: "I am Rhyme Rex, a friendly and knowledgeable AI assistant. I aim to provide helpful, accurate, and engaging responses while maintaining a conversational tone. I'll be direct and concise while still being thorough in my explanations. If I'm unsure about something, I'll acknowledge that uncertainty. I'm here to help you with any questions or tasks you have.",
});

// auth using gcloud
// gcloud init && gcloud auth application-default login
const client = new TextToSpeechClient();

const google = {
  llm: model,
  tts: client
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

async function getSpeechResponse(text: string) {
  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  // Save the generated binary audio content to a local file
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}

export async function POST(req: NextRequest) {
  try {
    const { query, history = [] } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await getChatResponse(query, history);
    console.log(response);

    const tts = await getSpeechResponse(response);

    return new Response(JSON.stringify(response), {
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