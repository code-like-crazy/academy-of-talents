import { AvailableAvatars } from "@/config/avatars";

// Base props for all scene components
export type SceneComponentProps = {
  className?: string;
};

// Props for the SceneCanvas component
export type SceneCanvasProps = {
  type: AvailableAvatars;
  expression?: string;
  text?: string;
  isSpeaking?: boolean;
  avatarZoom: [x: number, y: number, z: number];
};

// Props for the AvatarNameDisplay component
export type AvatarNameDisplayProps = {
  type: AvailableAvatars;
} & SceneComponentProps;

// Props for the ZoomButton component
export type ZoomButtonProps = {
  onZoom: () => void;
  isZoomedIn: boolean;
} & SceneComponentProps;

// Props for the SettingsDialog component
export type SettingsDialogProps = {
  onSettingChange?: (setting: string, value: any) => void;
} & SceneComponentProps;

// Props for the ExitButton component
export type ExitButtonProps = {
  onExit?: () => void;
} & SceneComponentProps;

// Message type for chat history
export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "avatar";
  timestamp: Date;
};

// Props for the ChatBox component
export type ChatBoxProps = {
  avatarName: string;
  onSendMessage?: (message: string) => void;
  initialMessages?: ChatMessage[];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
} & SceneComponentProps;
