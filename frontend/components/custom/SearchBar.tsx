'use client';
/* eslint-disable */
// @ts-nocheck

import { FC, useRef, useEffect, useState } from 'react';
import { Mic, Send, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SearchBarProps,
} from '@/lib/types';

export const SearchBar: FC<SearchBarProps> = ({ onSend, disabled = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window.webkitSpeechRecognition as any)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const transcript = result[0].transcript.trim();

          if (result.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current = finalTranscript.trim();
        }

        const displayText =
          finalTranscriptRef.current + (interimTranscript ? ' ' + interimTranscript : '');
        setValue(displayText.trim());
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      finalTranscriptRef.current = '';
    } else {
      setValue('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSend = async () => {
    if (!value.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSend(value);
      setValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!isSending && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isSending]);

  const handleReset = () => {
    window.location.reload();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '24px';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 200;
    const newHeight = Math.min(scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className="group relative flex w-full flex-col gap-1 rounded-3xl bg-gradient-to-br from-white to-gray-50/80 px-4 py-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.15)] hover:border-gray-200">
      <div className="px-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 2000))}
          onKeyDown={handleKeyDown}
          placeholder="Ask any questions"
          className="w-full resize-none border-none bg-transparent px-0 py-0 text-gray-700 placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          disabled={disabled}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              disabled={disabled}
              className={`h-10 w-10 rounded-full ${isRecording ? 'bg-red-100 text-red-500 hover:bg-red-100' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRecording ? <Square /> : <Mic />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={disabled}
              className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw />
            </Button>
            <span className="text-xs text-gray-400 ml-2">{value.length}/2000</span>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled}
            className={`h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};
