"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AvailableAvatars } from "@/config/avatars";

import { useChat } from "./avatar/hooks/useChat";
import {
  AvatarNameDisplay,
  ChatBox,
  ExitButton,
  SceneCanvas,
  SettingsDialog,
  ZoomButton,
} from "./scene-ui";
import { ImageDialog } from "./ui/image-dialog";

type SceneProps = {
  type: AvailableAvatars;
  expression?: string;
  text?: string;
  isSpeaking?: boolean;
};

export function Scene({
  type: initialType,
  expression = "default",
  text = "",
  isSpeaking = false,
}: SceneProps) {
  const router = useRouter();
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [avatarZoom, setAvatarZoom] = useState<
    [x: number, y: number, z: number]
  >([0, -0.45, 5]);
  const [avatarType, setAvatarType] = useState<AvailableAvatars>(initialType);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [currentAnimation, setCurrentAnimation] = useState("Idle");
  const [currentBackground, setCurrentBackground] = useState("sunset");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageDescription, setImageDescription] = useState("");

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

    switch (setting) {
      case "animation":
        // Toggle between animations
        if (value === true) {
          // If the current animation is already "Wave", switch to "Idle"
          // Otherwise, switch to "Wave"
          setCurrentAnimation(currentAnimation === "Wave" ? "Idle" : "Wave");
        } else if (typeof value === "string") {
          // If a specific animation is provided, use that
          setCurrentAnimation(value);
        }
        break;
      case "expression":
        // Toggle between expressions or set to a specific one
        if (value === true) {
          // If the current expression is already "happy", switch to "default"
          // Otherwise, switch to "happy"
          setCurrentExpression(
            currentExpression === "happy" ? "default" : "happy",
          );
        } else if (typeof value === "string") {
          // If a specific expression is provided, use that
          setCurrentExpression(value);
        }
        break;
      case "voice":
        // Voice settings would typically be handled by the chat system
        // This is a placeholder for future implementation
        console.log("Voice setting changed:", value);
        break;
      case "background":
        // Toggle between background environments
        if (value === true) {
          // Cycle through different environment presets
          const environments = [
            "sunset",
            "dawn",
            "night",
            "warehouse",
            "forest",
          ];
          const currentIndex = environments.indexOf(currentBackground);
          const nextIndex = (currentIndex + 1) % environments.length;
          setCurrentBackground(environments[nextIndex]);
        } else if (typeof value === "string") {
          // If a specific background is provided, use that
          setCurrentBackground(value);
        }
        break;
      case "avatar":
        // Change the avatar type
        if (
          typeof value === "string" &&
          ["teacher", "leo", "aria", "rex"].includes(value)
        ) {
          setAvatarType(value as AvailableAvatars);
        }
        break;
      default:
        console.log("Unknown setting:", setting);
    }
  };

  // Initialize the chat hook
  const { currentMessage, sendMessage, onMessagePlayed, loading } = useChat({
    avatarName: avatarType, // Use the current avatar type
  });

  // Check for image in current message
  useEffect(() => {
    if (currentMessage?.image && avatarType === "aria") {
      console.log("Image detected in message:", currentMessage.image);
      setGeneratedImage(currentMessage.image);
      setImageDescription(currentMessage.text);
      setImageDialogOpen(true);
    }
  }, [currentMessage, avatarType]);

  // Function to handle message sending
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Function to toggle chat visibility
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 3D Scene Canvas */}
      <SceneCanvas
        type={avatarType}
        expression={currentMessage?.facialExpression || currentExpression}
        text={currentMessage?.text || text}
        isSpeaking={!!currentMessage || isSpeaking}
        avatarZoom={avatarZoom}
        currentMessage={currentMessage}
        onMessagePlayed={onMessagePlayed}
        animation={currentAnimation}
        background={currentBackground}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0">
        <AvatarNameDisplay type={avatarType} />
        <ZoomButton onZoom={handleZoom} isZoomedIn={avatarZoom[2] === 6} />
        <SettingsDialog onSettingChange={handleSettingChange} />
        <ExitButton />
        <ChatBox
          avatarName={avatarType}
          onSendMessage={handleSendMessage}
          isVisible={isChatVisible}
          onToggleVisibility={toggleChatVisibility}
          currentMessage={currentMessage}
        />
      </div>

      {/* Image Dialog */}
      <ImageDialog
        isOpen={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        imageUrl={generatedImage || ""}
        description={imageDescription}
      />
    </div>
  );
}
