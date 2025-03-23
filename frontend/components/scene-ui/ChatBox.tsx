"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ChatBoxProps, ChatMessage } from "./types";

export function ChatBox({
  avatarName,
  onSendMessage,
  initialMessages = [],
  isVisible = true,
  onToggleVisibility,
  currentMessage,
}: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: "1",
            content: `Hello! I'm ${avatarName}. How can I help you today?`,
            sender: "avatar",
            timestamp: new Date(),
          },
        ],
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        setMessage(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Function to toggle recording
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setMessage("");
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);

    // Call the onSendMessage prop if provided
    if (onSendMessage) {
      onSendMessage(message);
    }

    // Clear the input
    setMessage("");
  };

  // Function to handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  // Track the last message to prevent duplicates
  const lastMessageRef = useRef<string | null>(null);

  // Add avatar response to chat history when currentMessage changes
  useEffect(() => {
    if (currentMessage && currentMessage.text) {
      // Check if this is a new message to avoid duplicates
      const messageId = `${currentMessage.text}-${Date.now()}`;
      if (lastMessageRef.current !== messageId) {
        // Create a new chat message from the avatar response
        const avatarMessage: ChatMessage = {
          id: Date.now().toString(),
          content: currentMessage.text,
          sender: "avatar",
          timestamp: new Date(),
        };

        // Add the message to chat history
        setChatHistory((prev) => [...prev, avatarMessage]);

        // Update the last message ref
        lastMessageRef.current = messageId;
      }
    }
  }, [currentMessage]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="absolute bottom-4 left-1/2 w-full max-w-xl -translate-x-1/2 transform px-4">
      {/* Chat Interface (when visible) */}
      <div className="flex flex-col gap-2">
        <>
          {isVisible && (
            // chat history
            <div
              ref={chatContainerRef}
              className="mb-2 max-h-[300px] flex-1 overflow-y-auto rounded-xl border border-slate-700/50 bg-slate-800/70 p-3 backdrop-blur-sm"
            >
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg px-3 py-2 text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700/80 text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <div className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/70 p-2 backdrop-blur-sm">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-10 resize-none border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${
                    isRecording
                      ? "bg-red-500/20 text-red-500"
                      : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                  onClick={toggleRecording}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-gray-400 hover:bg-slate-800/50 hover:text-white"
                  onClick={onToggleVisibility}
                >
                  <X className="mr-1 size-4" />
                  {isVisible ? "Hide Messages" : "Show Messages"}
                </Button>
              </div>
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
