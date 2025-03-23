"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic, Send, X } from "lucide-react";

import { avatars } from "@/config/avatars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "avatar";
  timestamp: Date;
}

export default function InteractiveSchoolPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Welcome to the Academy of Talents! How can I help you today?",
      sender: "avatar",
      timestamp: new Date(),
    },
  ]);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

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

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm here to help you navigate the school. What would you like to know?",
        sender: "avatar",
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, aiResponse]);
    }, 1000);

    // Clear the input
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Simulate loading the 3D environment
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-xl text-white">Loading School Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      {/* Background */}
      <div className="fixed inset-0 z-0 h-screen">
        <Image
          src="/backgrounds/hallway.webp"
          alt="School Hallway"
          fill
          className="object-cover opacity-70"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full">
        <div className="ml-auto w-full max-w-4xl px-8 py-12 pr-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Interactive Mode</h1>
            <Link href="/ui">
              <Button
                variant="outline"
                className="border-purple-500 bg-purple-600 text-white hover:bg-purple-700"
              >
                Switch to UI Mode
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {avatars.map((avatar) => (
              <Card
                key={avatar.id}
                className="overflow-hidden border-slate-700 bg-slate-800/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="relative aspect-video">
                  <Image
                    src={`/backgrounds/${avatar.id}.webp`}
                    alt={avatar.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    {avatar.name}
                  </h2>
                  <p className="mb-4 text-sm text-slate-300">
                    {getAvatarDescription(avatar.id)}
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Talk to {avatar.name.split(" ").pop()}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-slate-800/80 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Navigation Instructions
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium text-white">
                  Keyboard Controls
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    •{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      W
                    </span>{" "}
                    or{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      ↑
                    </span>{" "}
                    - Move forward
                  </li>
                  <li>
                    •{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      S
                    </span>{" "}
                    or{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      ↓
                    </span>{" "}
                    - Move backward
                  </li>
                  <li>
                    •{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      A
                    </span>{" "}
                    or{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      ←
                    </span>{" "}
                    - Move left
                  </li>
                  <li>
                    •{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      D
                    </span>{" "}
                    or{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      →
                    </span>{" "}
                    - Move right
                  </li>
                  <li>
                    •{" "}
                    <span className="rounded bg-slate-700 px-2 py-1 font-mono">
                      Space
                    </span>{" "}
                    - Interact with objects/characters
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium text-white">
                  Mouse Controls
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    • <strong>Left Click</strong> - Select objects or characters
                  </li>
                  <li>
                    • <strong>Right Click</strong> - Open context menu
                  </li>
                  <li>
                    • <strong>Mouse Movement</strong> - Look around
                  </li>
                  <li>
                    • <strong>Mouse Wheel</strong> - Zoom in/out
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAvatarDescription(id: string): string {
  switch (id) {
    case "aria":
      return "Creates AI-generated art and teaches artistic techniques.";
    case "rex":
      return "Composes music, writes raps, and explains music theory.";
    case "leo":
      return "Helps debug code and teaches programming concepts.";
    case "teacher":
      return "Guides students through the school environment and provides feedback.";
    default:
      return "An AI-powered student with unique talents.";
  }
}
