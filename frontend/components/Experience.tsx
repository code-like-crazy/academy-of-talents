"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CameraControls, Environment, Gltf } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion } from "motion/react";
import { MathUtils } from "three";

import { Message } from "@/lib/types";

import { SearchBar } from "./custom/SearchBar";
import { ImagePlane } from "./ImagePlane";
import { Teacher } from "./Teacher";

export const Experience = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendDisabled, setSendDisabled] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Add logging for image state changes
  useEffect(() => {
    console.log("Current image URL changed:", currentImage);
  }, [currentImage]);

  const playAudio = (base64Audio: string) => {
    if (audioRef.current) {
      const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    setSendDisabled(true);

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          history: messages,
          owner: "Artistic Aria",
        }),
      });

      const responseData = await response.json();
      console.log("responseData", responseData);

      // Set the image if it exists in the response
      if (responseData.image) {
        console.log("Setting new image URL:", responseData.image);
        setCurrentImage(responseData.image);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: responseData.text,
          image: responseData.image,
        },
      ]);

      // Play the audio response if it exists
      if (responseData.audio) {
        playAudio(responseData.audio);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setSendDisabled(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 0, 0.00001],
            fov: 75,
          }}
        >
          <CameraManager />
          <Environment preset="sunset" />
          <ambientLight intensity={0.3} color="white" />
          <Teacher
            teacher="krins"
            position={[-12.3, -12.0, -25.0]}
            scale={7.0}
            rotation-y={MathUtils.degToRad(30)}
          />
          {/* <Gltf src="/models/anime_class_room.glb" position={[2.5, -2.8, 10.0]} rotation={[0, Math.PI, 0]} /> */}
          <Gltf
            src="/models/anime_classroom.glb"
            position={[-12.3, -20.0, 59.0]}
            rotation={[0, MathUtils.degToRad(270), 0]}
          />

          {/* Display the image if available */}
          {currentImage && (
            <ImagePlane
              imageUrl={currentImage}
              position={[4.5, 4.5, -30]} // Moved to center, closer to camera
              scale={[30, 10, 10]} // Smaller scale
              rotation={[0, 0, 0]} // No rotation
            />
          )}
        </Canvas>
      </div>
      <motion.div
        key="chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col items-center pb-8"
      >
        <div className="w-full max-w-2xl">
          <div className="mb-4 max-h-[300px] flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
                {message.image && (
                  <div className="mt-2">
                    <Image
                      src={message.image}
                      alt="Generated image"
                      width={500}
                      height={300}
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

const CameraManager = () => {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={12}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
      mouseButtons={{
        left: 1, // rotate
        middle: 4, // pan
        right: 2, // pan
        wheel: 16, // zoom
      }}
      touches={{
        one: 32, // rotate
        two: 512, // zoom
        three: 1024, // pan
      }}
    />
  );
};
