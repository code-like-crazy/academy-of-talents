import { useCallback, useEffect, useState } from "react";

export interface ChatMessage {
  text: string;
  audio: string; // base64 encoded audio
  lipsync: {
    metadata?: {
      soundFile: string;
      duration: number;
    };
    mouthCues: Array<{
      start: number;
      end: number;
      value: string; // Phoneme value (A, B, C, D, E, F, G, H, X)
    }>;
  };
  facialExpression?: string;
  animation?: string;
}

interface UseChatProps {
  avatarName: string;
}

export const useChat = ({ avatarName }: UseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // Process messages queue
  useEffect(() => {
    if (messages.length > 0 && !currentMessage) {
      setCurrentMessage(messages[0]);
    } else if (messages.length === 0) {
      setCurrentMessage(null);
    }
  }, [messages, currentMessage]);

  // Function to send a chat message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      setLoading(true);

      try {
        console.log(
          `Sending message to avatar API: "${message}" for avatar: ${avatarName}`,
        );

        const response = await fetch("/api/chat/avatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            agent_name: avatarName,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Received response from avatar API:", {
          textLength: data.text?.length || 0,
          audioLength: data.audio?.length || 0,
          hasLipsync: !!data.lipsync,
          lipsyncMouthCues: data.lipsync?.mouthCues?.length || 0,
        });

        // Validate lipsync data
        if (
          !data.lipsync ||
          !data.lipsync.mouthCues ||
          !Array.isArray(data.lipsync.mouthCues)
        ) {
          console.error(
            "Invalid or missing lipsync data in API response:",
            data.lipsync,
          );
        }

        // Add the response to the messages queue
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    },
    [avatarName],
  );

  // Function to handle when a message has been played
  const onMessagePlayed = useCallback(() => {
    console.log("onMessagePlayed callback triggered in useChat");
    setMessages((prev) => prev.slice(1));
    setCurrentMessage(null);
  }, []);

  return {
    currentMessage,
    sendMessage,
    onMessagePlayed,
    loading,
    cameraZoomed,
    setCameraZoomed,
  };
};
