"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import { rhubarbPhonemes } from "@/config/avatar/rhubarb";
import { AvailableAvatars } from "@/config/avatars";

import { useAvatar } from "./hooks/useAvatar";
import { ChatMessage } from "./hooks/useChat";
import { useRhubarb } from "./hooks/useRhubarb";
import { AvatarGLTFResult } from "./types";

let setupMode = false;

type Props = {
  type: AvailableAvatars;
  expression?: string;
  text?: string;
  isSpeaking?: boolean;
  currentMessage?: ChatMessage | null;
} & JSX.IntrinsicElements["group"];

export function Avatar({
  type,
  expression = "default",
  text = "",
  isSpeaking = false,
  currentMessage,
  ...props
}: Props): JSX.Element {
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
  const [facialExpression, setFacialExpression] = useState(expression);

  // Update facial expression when prop changes
  useEffect(() => {
    setFacialExpression(expression);
  }, [expression]);

  // Map Rhubarb phonemes to viseme morphs
  const phonemeToViseme: Record<string, string> = {
    A: "viseme_PP", // Vowel sound in "bat"
    B: "viseme_kk", // B, M, P sounds
    C: "viseme_I", // Vowel sound in "bot"
    D: "viseme_AA", // D, T, N sounds
    E: "viseme_O", // Vowel sound in "bet"
    F: "viseme_U", // F, V sounds
    G: "viseme_FF", // Vowel sound in "boot"
    H: "viseme_TH", // L, R sounds
    X: "viseme_PP", // Neutral/rest position
  };

  // Store audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update animation when currentMessage changes
  useEffect(() => {
    if (!actions) return;

    // If we have a current message with an animation specified, use that
    if (currentMessage?.animation && actions[currentMessage.animation]) {
      const newAnimation = currentMessage.animation;
      setAnimation(newAnimation);
      setFacialExpression(currentMessage.facialExpression || "default");
    } else if (!currentMessage && actions["Idle"]) {
      // Reset to Idle when no message is playing
      setAnimation("Idle");
    }
  }, [currentMessage, actions]);

  // Play the current animation
  useEffect(() => {
    if (!actions || !actions[animation]) return;

    // Stop all currently running animations
    Object.values(actions).forEach((action) => {
      if (action && action.isRunning()) {
        action.fadeOut(0.5);
      }
    });

    // Play the new animation
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(0.5).play();

      return () => {
        action.fadeOut(0.5);
      };
    }
  }, [animation, actions]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.5) => {
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
          // Only try to update Leva controls if they exist
          if (typeof setControls === "function") {
            setControls({
              [target]: value,
            });
          }
        } catch {
          // Ignore errors when setting control values
        }
      }
    });
  };

  // Handle audio playback for lip sync
  useEffect(() => {
    if (!currentMessage?.audio) return;

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    // Set audio source
    audioRef.current.src = `data:audio/mp3;base64,${currentMessage.audio}`;

    // Set up onended callback
    const handleAudioEnd = () => {
      // Call onMessagePlayed directly from the Scene component
      if (currentMessage) {
        // Try to find the onMessagePlayed function in the group hierarchy
        // First check our own group's userData
        if (group.current?.userData?.onMessagePlayed) {
          group.current.userData.onMessagePlayed();
        }
        // Then check our parent's userData
        else if (group.current?.parent?.userData?.onMessagePlayed) {
          group.current.parent.userData.onMessagePlayed();
        }
        // Then check the parent's parent (the scene root)
        else if (group.current?.parent?.parent?.userData?.onMessagePlayed) {
          group.current.parent.parent.userData.onMessagePlayed();
        }
        // If all else fails, try to find it in the scene
        else {
          // Find the root scene
          let root: THREE.Object3D | null = group.current;
          while (root?.parent) {
            root = root.parent;
          }

          // Try to find any object with the callback
          let found = false;
          root?.traverse((obj) => {
            if (!found && obj.userData?.onMessagePlayed) {
              obj.userData.onMessagePlayed();
              found = true;
            }
          });
        }
      }
    };

    audioRef.current.onended = handleAudioEnd;

    // Play audio when component mounts or message changes
    if (isSpeaking) {
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [currentMessage, isSpeaking]);

  useFrame(() => {
    // LIPSYNC
    if (setupMode) {
      return;
    }

    // Handle Rhubarb lip sync data if available
    const appliedMorphTargets: string[] = [];
    if (currentMessage?.lipsync?.mouthCues && isSpeaking && audioRef.current) {
      const currentAudioTime = audioRef.current.currentTime;
      const mouthCues = currentMessage.lipsync.mouthCues;

      if (mouthCues.length > 0) {
        // Find the current mouth cue based on time
        for (let i = 0; i < mouthCues.length; i++) {
          const cue = mouthCues[i];
          if (currentAudioTime >= cue.start && currentAudioTime <= cue.end) {
            // Get the viseme for this phoneme
            const viseme = phonemeToViseme[cue.value] || phonemeToViseme.X;
            appliedMorphTargets.push(viseme);
            lerpMorphTarget(viseme, 1, 0.2);
            break;
          }
        }
      }
    }

    // Reset all visemes that aren't currently active
    Object.values(phonemeToViseme).forEach((viseme) => {
      if (!appliedMorphTargets.includes(viseme)) {
        lerpMorphTarget(viseme, 0, 0.1);
      }
    });

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
          lerpMorphTarget(key, mapping[key as keyof typeof mapping], 0.5);
        } else {
          lerpMorphTarget(key, 0, 0.5);
        }
      });
    }

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);
  });

  const [setControls] = useControls("MorphTarget", () => {
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

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      const delay =
        typeof window !== "undefined"
          ? THREE.MathUtils.randInt(1000, 5000)
          : 3000; // Default delay for initial server render

      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, delay);
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
