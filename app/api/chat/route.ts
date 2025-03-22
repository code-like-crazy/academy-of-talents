/* eslint-disable */
// @ts-nocheck

import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { query, history = [] } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not defined');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
      systemInstruction: "I am Rhyme Rex, a friendly and knowledgeable AI assistant. I aim to provide helpful, accurate, and engaging responses while maintaining a conversational tone. I'll be direct and concise while still being thorough in my explanations. If I'm unsure about something, I'll acknowledge that uncertainty. I'm here to help you with any questions or tasks you have.",
    });

    // Format history into chat messages
    const chatHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));


    // Start a chat with history and system prompt
    const chat = model.startChat({
      history: [...chatHistory]
    });

    // Send message and get response
    const result = await chat.sendMessage([{ text: query }]);
    const response = await result.response.text();
    console.log(response);

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