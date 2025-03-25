"use client";

// @ts-nocheck
import { FC, useEffect, useRef, useState } from "react";
import { Mic, RotateCcw, Send, Square } from "lucide-react";

import type {
  SearchBarProps,
  SpeechRecognition,
  SpeechRecognitionEvent,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const SearchBar: FC<SearchBarProps> = ({ onSend, disabled = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window.webkitSpeechRecognition as any)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const transcript = result[0].transcript.trim();

          if (result.isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current = finalTranscript.trim();
        }

        const displayText =
          finalTranscriptRef.current +
          (interimTranscript ? " " + interimTranscript : "");
        setValue(displayText.trim());
      };

      recognition.onend = () => {
        console.log("recognition ended");
      };

      recognitionRef.current = recognition;
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      finalTranscriptRef.current = "";
    } else {
      setValue("");
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSend = async () => {
    if (!value.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSend(value);
      setValue("");
    } catch (error) {
      console.error("Error sending message:", error);
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "24px";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 200;
    const newHeight = Math.min(scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className="group to-slate-600-400/30 relative flex w-full flex-col gap-1 rounded-3xl rounded-xl border border-slate-100/30 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 p-4 px-4 py-2 backdrop-blur-md">
      <div className="px-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 2000))}
          onKeyDown={handleKeyDown}
          placeholder="Ask any questions"
          className="w-full resize-none border-none bg-transparent px-0 py-0 text-white placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-100"
          rows={1}
          disabled={disabled}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              disabled={disabled}
              className={`h-10 w-10 rounded-full ${isRecording ? "bg-red-100 text-red-500 hover:bg-red-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-900"} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isRecording ? <Square /> : <Mic />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={disabled}
              className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw />
            </Button>
            <span className="ml-2 text-xs text-gray-400">
              {value.length}/2000
            </span>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled}
            className={`h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};
