'use client';
/* eslint-disable */
// @ts-nocheck

import { SearchBar } from "@/components/custom/SearchBar";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendDisabled, setSendDisabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = (base64Audio: string) => {
    if (audioRef.current) {
      const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    setSendDisabled(true);
  
    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          history: messages
        })
      });
  
      const responseData = await response.json();
      console.log('responseData', responseData);
  
      setMessages((prev) => [...prev, { 
        role: 'model', 
        content: responseData.text,
        image: responseData.image 
      }]);
      
      // Play the audio response
      if (responseData.audio) {
        playAudio(responseData.audio);
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Sorry, there was an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setSendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-24 overflow-hidden border border-gray-200">
      <motion.div
        key="chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="flex-1 flex flex-col w-full items-center"
      >
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center mb-2">
            <span className="text-xs text-zinc-400">
              Interacting with{' '}
              <span className="text-purple-400 font-medium">Rhyme Rex</span>
            </span>
          </div>
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.content}
                </div>
                {message.image && (
                  <div className="mt-2">
                    <img 
                      src={message.image} 
                      alt="Generated image" 
                      className="max-w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <SearchBar onSend={handleSendMessage} disabled={sendDisabled} />
        </div>
      </motion.div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default ChatPage;
