"use client";

import { button, useControls } from "leva";

import { teacherFacialExpressions } from "@/config/avatar/teacher";

import type { AvatarGLTFResult } from "./types";

type Props = {
  nodes: AvatarGLTFResult["nodes"]["EyeLeft"];
  setupMode: boolean;
  setSetupMode: (value: boolean) => void;
  animation: string;
  setAnimation: (value: string) => void;
  facialExpression: string;
  setFacialExpression: (value: string) => void;
  animations: { name: string }[];
  setWinkLeft: (value: boolean) => void;
  setWinkRight: (value: boolean) => void;
  lerpMorphTarget: (target: string, value: number, speed?: number) => void;
};

export function AvatarControls({
  nodes,
  setupMode,
  setSetupMode,
  animation,
  setAnimation,
  facialExpression,
  setFacialExpression,
  animations,
  setWinkLeft,
  setWinkRight,
  lerpMorphTarget,
}: Props) {
  useControls("FacialExpressions", {
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      value: facialExpression,
      options: Object.keys(teacherFacialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setSetupMode(true);
    }),
    disableSetupMode: button(() => {
      setSetupMode(false);
    }),
    logMorphTargetValues: button(() => {
      if (!nodes.morphTargetDictionary || !nodes.morphTargetInfluences) return;

      const emotionValues: Record<string, number> = {};
      Object.keys(nodes.morphTargetDictionary).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return;
        }
        if (!nodes.morphTargetInfluences || !nodes.morphTargetDictionary)
          return;

        const value =
          nodes.morphTargetInfluences[nodes.morphTargetDictionary[key]];
        if (value > 0.01) {
          emotionValues[key] = value;
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  useControls("MorphTarget", () => {
    if (!nodes.morphTargetDictionary || !nodes.morphTargetInfluences) {
      return {};
    }

    return Object.assign(
      {},
      ...Object.keys(nodes.morphTargetDictionary).map((key) => ({
        [key]: {
          label: key,
          value: 0,
          min:
            nodes.morphTargetDictionary &&
            nodes.morphTargetInfluences &&
            nodes.morphTargetInfluences[nodes.morphTargetDictionary[key]],
          max: 1,
          onChange: (val: number) => {
            if (setupMode) {
              lerpMorphTarget(key, val, 1);
            }
          },
        },
      })),
    );
  });

  return null;
}
