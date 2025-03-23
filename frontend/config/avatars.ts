import {
  ARIA_ANIMATIONS_PATH,
  ARIA_MODEL_PATH,
  ariaFacialExpressions,
} from "./avatar/aria";
import { DEFAULT_BLINK_SETTINGS } from "./avatar/defaults";
import {
  TEACHER_ANIMATIONS_PATH,
  TEACHER_MODEL_PATH,
  teacherFacialExpressions,
} from "./avatar/teacher";

export interface Avatar {
  id: "teacher" | "aria" | "rex";
  name: string;
  modelPath: string;
  animationsPath: string;
  blinkSettings: BlinkSettings;
  facialExpressions: Record<string, Record<string, number>>;
}

export type AvailableAvatars = (typeof avatars)[number]["id"];

export const avatars: Avatar[] = [
  {
    id: "teacher",
    name: "Teacher",
    modelPath: TEACHER_MODEL_PATH,
    animationsPath: TEACHER_ANIMATIONS_PATH,
    blinkSettings: DEFAULT_BLINK_SETTINGS,
    facialExpressions: teacherFacialExpressions,
  },
  {
    id: "aria",
    name: "Aria",
    modelPath: ARIA_MODEL_PATH,
    animationsPath: ARIA_ANIMATIONS_PATH,
    blinkSettings: DEFAULT_BLINK_SETTINGS,
    facialExpressions: ariaFacialExpressions,
  },
];

export interface BlinkSettings {
  minInterval: number;
  maxInterval: number;
  duration: number;
}

export const getAvatarById = (id: string): Avatar | undefined => {
  return avatars.find((avatar) => avatar.id === id);
};
