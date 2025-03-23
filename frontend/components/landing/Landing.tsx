"use client"
import { useEffect, useRef, useState } from "react";
import { Experience } from "../Experience";
import { Scene } from "./Scene";
import { Title } from "./Title";
import { StartButton } from "./StartButton";
import styles from "./Landing.module.css";

export const Landing = () => {
  const [isZooming, setIsZooming] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.src = '/sounds/075176_duck-quack-40345.mp3';
    audio.preload = 'auto';
    
    // Add error handling
    audio.onerror = (e) => {
      console.error('Error loading audio:', e);
      console.error('Audio error details:', audio.error);
    };

    // Add load handling
    audio.oncanplaythrough = () => {
      console.log('Audio loaded successfully');
      audioRef.current = audio;
    };

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStartClick = () => {
    setIsZooming(true);
  };

  const handleAnimationComplete = () => {
    // Wait 1 second after animation completes before playing audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        console.error('Audio element not initialized');
      }
      // Wait another second before showing Experience
      setTimeout(() => {
        setShowExperience(true);
      }, 1000);
    }, 1000);
  };

  if (showExperience) {
    return <Experience />;
  }

  return (
    <div className={styles.container}>
      <Title />
      <Scene isZooming={isZooming} onAnimationComplete={handleAnimationComplete} />
      <StartButton onClick={handleStartClick} />
    </div>
  );
}; 