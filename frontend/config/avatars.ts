import {
  ARIA_ANIMATIONS_PATH,
  ARIA_MODEL_PATH,
  ariaFacialExpressions,
} from "./avatar/aria";
import { DEFAULT_BLINK_SETTINGS } from "./avatar/defaults";
import {
  LEO_ANIMATIONS_PATH,
  LEO_MODEL_PATH,
  leoFacialExpressions,
} from "./avatar/leo";
import {
  REX_ANIMATIONS_PATH,
  REX_MODEL_PATH,
  rexFacialExpressions,
} from "./avatar/rex";
import {
  TEACHER_ANIMATIONS_PATH,
  TEACHER_MODEL_PATH,
  teacherFacialExpressions,
} from "./avatar/teacher";

export interface Avatar {
  id: "teacher" | "aria" | "rex" | "leo";
  name: string;
  modelPath: string;
  animationsPath: string;
  blinkSettings: BlinkSettings;
  facialExpressions: Record<string, Record<string, number>>;
}

export type AvailableAvatars = (typeof avatars)[number]["id"];

export const avatarBackgrounds: Record<AvailableAvatars, string> = {
  teacher: "/backgrounds/teacher.webp",
  aria: "/backgrounds/aria.webp",
  rex: "/backgrounds/rex.webp",
  leo: "/backgrounds/leo.webp",
};

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
    name: "Artistic Aria",
    modelPath: ARIA_MODEL_PATH,
    animationsPath: ARIA_ANIMATIONS_PATH,
    blinkSettings: DEFAULT_BLINK_SETTINGS,
    facialExpressions: ariaFacialExpressions,
  },
  {
    id: "rex",
    name: "Rhythm Rex",
    modelPath: REX_MODEL_PATH,
    animationsPath: REX_ANIMATIONS_PATH,
    blinkSettings: DEFAULT_BLINK_SETTINGS,
    facialExpressions: rexFacialExpressions,
  },
  {
    id: "leo",
    name: "Logic Leo",
    modelPath: LEO_MODEL_PATH,
    animationsPath: LEO_ANIMATIONS_PATH,
    blinkSettings: DEFAULT_BLINK_SETTINGS,
    facialExpressions: leoFacialExpressions,
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

export const getAvatarBackground = (id: AvailableAvatars): string => {
  return avatarBackgrounds[id];
};
