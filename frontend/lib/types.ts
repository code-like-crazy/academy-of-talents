// Speech Recognition Types
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export type Message = {
  role: 'user' | 'model';
  content: string;
  image?: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

// Component Props Types
export interface SearchBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
} 

export type AssistantTypes = [
  "maths",
  "python",
  "javascript",
  "science",
  "history",
  "geography",
  "literature",
  "art",
  "music",
  "sports",
]