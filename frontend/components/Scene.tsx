"use client";

import { useState } from "react";

import { AvailableAvatars } from "@/config/avatars";

import {
  AvatarNameDisplay,
  ChatBox,
  ExitButton,
  SceneCanvas,
  SettingsDialog,
  ZoomButton,
} from "./scene-ui";

type SceneProps = {
  type: AvailableAvatars;
  expression?: string;
  text?: string;
  isSpeaking?: boolean;
};

export function Scene({
  type,
  expression = "default",
  text = "",
  isSpeaking = false,
}: SceneProps) {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [avatarZoom, setAvatarZoom] = useState<
    [x: number, y: number, z: number]
  >([0, -0.45, 5]);

  // Function to handle zoom button click
  const handleZoom = () => {
    // zoomed in: [0, -0.35, 6]
    // zoomed out: [0, -0.45, 5]

    const zoomedIn = avatarZoom[2] === 5; // Check if currently zoomed out (at z=5)
    const newZoom: [x: number, y: number, z: number] = zoomedIn
      ? [0, -0.35, 6] // If currently at 5, zoom in to 6
      : [0, -0.45, 5]; // If currently at 6, zoom out to 5
    setAvatarZoom(newZoom);
  };

  // Function to handle settings changes
  const handleSettingChange = (setting: string, value: any) => {
    console.log(`Setting ${setting} changed to:`, value);
    // Here you would implement the actual setting change logic
  };

  // Function to handle message sending
  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // Here you would call your useChat hook to send the message
  };

  // Function to toggle chat visibility
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 3D Scene Canvas */}
      <SceneCanvas
        type={type}
        expression={expression}
        text={text}
        isSpeaking={isSpeaking}
        avatarZoom={avatarZoom}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0">
        <AvatarNameDisplay type={type} />
        <ZoomButton onZoom={handleZoom} isZoomedIn={avatarZoom[2] === 6} />
        <SettingsDialog onSettingChange={handleSettingChange} />
        <ExitButton />
        <ChatBox
          avatarName={type}
          onSendMessage={handleSendMessage}
          isVisible={isChatVisible}
          onToggleVisibility={toggleChatVisibility}
        />
      </div>
    </div>
  );
}
