import { DEFAULT_BLINK_SETTINGS } from "./avatar/defaults";
import { TEACHER_ANIMATIONS_PATH, TEACHER_MODEL_PATH } from "./avatar/teacher";

export interface Avatar {
  id: string;
  name: string;
  modelPath: string;
  animationsPath: string;
  blinkSettings: BlinkSettings;
}

export interface BlinkSettings {
  minInterval: number;
  maxInterval: number;
  duration: number;
}

export const avatars: Avatar[] = [
  {
    id: "teacher",
    name: "Teacher",
    modelPath: TEACHER_MODEL_PATH,
    animationsPath: TEACHER_ANIMATIONS_PATH,
    blinkSettings: DEFAULT_BLINK_SETTINGS,
  },
];

export const getAvatarById = (id: string): Avatar | undefined => {
  return avatars.find((avatar) => avatar.id === id);
};
