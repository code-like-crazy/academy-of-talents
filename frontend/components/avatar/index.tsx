"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import { useAvatar } from "./hooks/useAvatar";
import { AvatarGLTFResult } from "./types";

let setupMode = false;

type Props = {
  type: "teacher"; // Add more avatar types as they become available
};

export function Avatar({
  type,
  ...props
}: JSX.IntrinsicElements["group"] & Props) {
  const group = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Object3D | null>(null);
  const {
    animationsPath,
    modelPath,
    facialExpressions,
    component: AvatarComponent,
  } = useAvatar(type);

  const { nodes, materials, scene } = useGLTF(
    modelPath,
    true,
  ) as unknown as AvatarGLTFResult;
  const { animations } = useGLTF(animationsPath) as unknown as GLTF;

  // Store scene reference for traversal
  useEffect(() => {
    if (!scene) return;
    sceneRef.current = scene;
  }, [scene]);

  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name,
  );

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");

  useEffect(() => {
    if (!actions || !actions[animation]) return;

    const action = actions[animation].reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animation, actions]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child) => {
      const skinnedMesh = child as THREE.SkinnedMesh;
      if (
        !skinnedMesh.isSkinnedMesh ||
        !skinnedMesh.morphTargetDictionary ||
        !skinnedMesh.morphTargetInfluences
      ) {
        return;
      }

      const index = skinnedMesh.morphTargetDictionary[target];
      if (
        index === undefined ||
        skinnedMesh.morphTargetInfluences[index] === undefined
      ) {
        return;
      }

      skinnedMesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        skinnedMesh.morphTargetInfluences[index],
        value,
        speed,
      );

      if (!setupMode) {
        try {
          set({
            [target]: value,
          });
        } catch {
          // Ignore errors when setting control values
        }
      }
    });
  };

  useFrame(() => {
    if (
      !nodes.EyeLeft.morphTargetDictionary ||
      !nodes.EyeLeft.morphTargetInfluences
    ) {
      return;
    }

    if (!setupMode) {
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        const mapping =
          facialExpressions[facialExpression as keyof typeof facialExpressions];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return;
        }
        if (mapping && mapping[key as keyof typeof mapping]) {
          lerpMorphTarget(key, mapping[key as keyof typeof mapping], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });
    }

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);
  });

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
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
    logMorphTargetValues: button(() => {
      if (
        !nodes.EyeLeft.morphTargetDictionary ||
        !nodes.EyeLeft.morphTargetInfluences
      )
        return;

      const emotionValues: Record<string, number> = {};
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return;
        }
        if (
          !nodes.EyeLeft.morphTargetInfluences ||
          !nodes.EyeLeft.morphTargetDictionary
        )
          return;

        const value =
          nodes.EyeLeft.morphTargetInfluences[
            nodes.EyeLeft.morphTargetDictionary[key]
          ];
        if (value > 0.01) {
          emotionValues[key] = value;
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  const [, set] = useControls("MorphTarget", () => {
    if (
      !nodes.EyeLeft.morphTargetDictionary ||
      !nodes.EyeLeft.morphTargetInfluences
    ) {
      return {};
    }

    return Object.assign(
      {},
      ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => ({
        [key]: {
          label: key,
          value: 0,
          min:
            nodes.EyeLeft.morphTargetDictionary &&
            nodes.EyeLeft.morphTargetInfluences &&
            nodes.EyeLeft.morphTargetInfluences[
              nodes.EyeLeft.morphTargetDictionary[key]
            ],
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

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => {
            setBlink(false);
            nextBlink();
          }, 200);
        },
        THREE.MathUtils.randInt(1000, 5000),
      );
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <AvatarComponent nodes={nodes} materials={materials} />
    </group>
  );
}

useGLTF.preload("/models/avatars/teacher.glb");
useGLTF.preload("/models/animations/teacher-animations.glb");
