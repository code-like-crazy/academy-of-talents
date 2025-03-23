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
  systemInstruction: "You are the presentation assistant and you will get the user prompt. Only return JSON in the following order: {intent: 'intent'}, where you intent is either 'photo' or 'other'. Just sent the JSON, donst start with ```json or ```",
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
    parts: [{ text: msg.content || '' }] // Ensure content is never undefined
  }));

  // Start a chat with history and system prompt
  const chat = google.llm.startChat({
    history: chatHistory,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });

  try {
    // Send message and get response
    const result = await chat.sendMessage([{ text: query }]);
    return result.response.text();
  } catch (error) {
    console.error('Error in chat response:', error);
    throw error;
  }
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
  try {
    const chat = google.llm_intent.startChat({
      history: []
    });
    const result = await chat.sendMessage(query);
    const text = result.response.text();
    console.log("raw intent response:", text);
    
    // Clean up the response text
    let jsonText = text;
    
    // Remove markdown code block if present
    if (text.startsWith('```json')) {
      jsonText = text.slice(7, -3);
    } else if (text.startsWith('```')) {
      jsonText = text.slice(3, -3);
    }
    
    // Remove any whitespace and newlines
    jsonText = jsonText.trim();
    
    // Ensure the response is in the correct format
    if (!jsonText.startsWith('{')) {
      jsonText = `{"intent": "${jsonText}"}`;
    }
    
    console.log("cleaned intent json:", jsonText);
    
    const parsed = JSON.parse(jsonText);
    // Ensure the response has the correct structure
    if (!parsed.intent) {
      return { intent: 'other' }; // Default to 'other' if no intent is found
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing intent:', error);
    return { intent: 'other' }; // Default to 'other' on error
  }
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
