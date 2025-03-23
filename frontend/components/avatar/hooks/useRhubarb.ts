import { useEffect, useRef, useState } from 'react';
import { rhubarbPhonemes, rhubarbConfig } from '@/config/avatar/rhubarb';

type RhubarbPhoneme = keyof typeof rhubarbPhonemes;

interface UseRhubarbProps {
  text: string;
  onPhonemeChange: (phoneme: RhubarbPhoneme) => void;
  isPlaying?: boolean;
}

export const useRhubarb = ({ text, onPhonemeChange, isPlaying = true }: UseRhubarbProps) => {
  const [currentPhoneme, setCurrentPhoneme] = useState<RhubarbPhoneme>('X');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const phonemeQueueRef = useRef<RhubarbPhoneme[]>([]);

  // Convert text to phonemes (simplified version)
  const textToPhonemes = (text: string): RhubarbPhoneme[] => {
    const words = text.toLowerCase().split(' ');
    const phonemes: RhubarbPhoneme[] = [];
    
    words.forEach((word, index) => {
      // Add phonemes for each character
      word.split('').forEach(char => {
        // Map characters to phonemes (simplified)
        switch (char) {
          case 'a':
          case 'e':
          case 'i':
          case 'o':
          case 'u':
            phonemes.push('A');
            break;
          case 'b':
          case 'm':
          case 'p':
            phonemes.push('B');
            break;
          case 'c':
          case 'k':
          case 's':
            phonemes.push('C');
            break;
          case 'd':
          case 'n':
          case 't':
            phonemes.push('D');
            break;
          case 'f':
          case 'v':
            phonemes.push('F');
            break;
          case 'g':
          case 'j':
            phonemes.push('G');
            break;
          case 'h':
          case 'l':
          case 'r':
            phonemes.push('H');
            break;
          default:
            phonemes.push('X');
        }
      });
      
      // Add rest state between words
      if (index < words.length - 1) {
        phonemes.push('X');
      }
    });
    
    return phonemes;
  };

  // Play next phoneme
  const playNextPhoneme = () => {
    if (phonemeQueueRef.current.length === 0) {
      setCurrentPhoneme('X');
      return;
    }

    const nextPhoneme = phonemeQueueRef.current.shift()!;
    setCurrentPhoneme(nextPhoneme);
    onPhonemeChange(nextPhoneme);

    timeoutRef.current = setTimeout(() => {
      playNextPhoneme();
    }, rhubarbConfig.defaultDuration * 1000);
  };

  // Start lip sync
  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setCurrentPhoneme('X');
      return;
    }

    phonemeQueueRef.current = textToPhonemes(text);
    playNextPhoneme();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isPlaying]);

  return {
    currentPhoneme,
    isPlaying,
  };
}; 