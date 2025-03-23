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
  // Function to handle zoom button click
  const handleZoom = (zoomIn: boolean) => {
    // Use type assertion to avoid TypeScript error
    const canvas = document.querySelector("canvas");
    const controls = canvas ? (canvas as any)["__r3f"]?.["controls"] : null;
    if (controls) {
      const targetDistance = zoomIn ? 1.5 : 5;
      controls.dollyTo(targetDistance, true);
    }
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
      />

      {/* UI Overlay */}
      <div className="absolute inset-0">
        <AvatarNameDisplay type={type} />
        <ZoomButton onZoom={handleZoom} />
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
