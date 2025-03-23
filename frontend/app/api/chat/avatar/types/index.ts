import { NextRequest } from "next/server";

export type AgentName =
  | "Artistic Aria"
  | "Rhyme Rex"
  | "Logic Leo"
  | "Thinking Ponder"
  | "Dramatic Delilah"
  | "Shadow Sam"
  | "Teacher"
  | "default";

export interface AvatarExpressions {
  default: string;
  happy: string;
  sad: string;
  surprised: string;
  angry: string;
  animations: string[];
}

export interface ChatRequest {
  message: string;
  agent_name?: string;
}

export interface ChatResponse {
  text: string;
  audio: string;
  lipsync: LipSyncData;
  facialExpression: string;
  animation: string;
  image?: string;
}

export interface LipSyncData {
  metadata: {
    soundFile?: string;
    duration?: number;
    processedAt?: string;
    error?: string;
  };
  mouthCues: Array<{
    start: number;
    end: number;
    value: string;
  }>;
}

export interface IntentResponse {
  intent: string;
}
