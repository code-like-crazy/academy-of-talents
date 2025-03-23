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
  // These mappings are based on the standard Rhubarb phoneme set
  // and the available visemes in the avatar model
  const phonemeToViseme: Record<string, string> = {
    A: "viseme_PP", // Vowel sound in "bat" - Closed lips
    B: "viseme_kk", // B, M, P sounds - Slightly open mouth
    C: "viseme_I", // Vowel sound in "bot" - Open mouth
    D: "viseme_AA", // D, T, N sounds - Wide open mouth
    E: "viseme_O", // Vowel sound in "bet" - Rounded lips
    F: "viseme_U", // F, V sounds - Teeth on lower lip
    G: "viseme_FF", // Vowel sound in "boot" - Rounded small opening
    H: "viseme_TH", // L, R sounds - Tongue visible
    X: "viseme_PP", // Neutral/rest position - Closed lips
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

    // Create or reset audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // Configure audio settings for better lip sync
    audio.preload = "auto";
    audio.playbackRate = 1.0;

    // Log lip sync data for debugging
    if (
      process.env.NODE_ENV === "development" &&
      currentMessage?.lipsync?.mouthCues
    ) {
      console.log(
        `Lip sync data loaded with ${currentMessage.lipsync.mouthCues.length} mouth cues`,
      );
      if (currentMessage.lipsync.metadata) {
        console.log(
          `Audio duration from metadata: ${currentMessage.lipsync.metadata.duration}s`,
        );
      }
    }

    // Set up event handlers
    const handleCanPlay = () => {
      if (isSpeaking && audio.paused) {
        console.log(`Starting audio playback, duration: ${audio.duration}s`);
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
        });
      }
    };

    const handleAudioEnd = () => {
      console.log("Audio playback ended");

      // Find and call onMessagePlayed callback
      const findAndCallCallback = (obj: THREE.Object3D | null) => {
        if (!obj) return false;

        if (obj.userData?.onMessagePlayed) {
          obj.userData.onMessagePlayed();
          return true;
        }

        // Check parent
        if (obj.parent && findAndCallCallback(obj.parent)) {
          return true;
        }

        // Check children
        let found = false;
        obj.traverse((child) => {
          if (!found && child.userData?.onMessagePlayed) {
            child.userData.onMessagePlayed();
            found = true;
          }
        });

        return found;
      };

      if (currentMessage) {
        findAndCallCallback(group.current);
      }
    };

    // Set up audio element
    audio.src = `data:audio/mp3;base64,${currentMessage.audio}`;
    audio.oncanplay = handleCanPlay;
    audio.onended = handleAudioEnd;

    // Add timeupdate event for debugging
    if (process.env.NODE_ENV === "development") {
      const handleTimeUpdate = () => {
        // Log every second for debugging
        if (
          Math.floor(audio.currentTime) !== Math.floor(audio.currentTime - 0.1)
        ) {
          console.log(
            `Audio time: ${audio.currentTime.toFixed(2)}s / ${audio.duration.toFixed(2)}s`,
          );
        }
      };
      audio.ontimeupdate = handleTimeUpdate;
    }

    // Handle errors
    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      handleAudioEnd(); // Ensure message completion even if audio fails
    };

    // Cleanup function
    return () => {
      audio.oncanplay = null;
      audio.onended = null;
      audio.onerror = null;
      if (process.env.NODE_ENV === "development") {
        audio.ontimeupdate = null;
      }
      audio.pause();
      audio.src = "";
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
      if (!audioRef.current.paused && !isNaN(audioRef.current.duration)) {
        const currentAudioTime = audioRef.current.currentTime;
        const mouthCues = currentMessage.lipsync.mouthCues;

        if (mouthCues.length > 0) {
          // Find the current mouth cue based on time
          let activeCue = null;
          for (let i = 0; i < mouthCues.length; i++) {
            const cue = mouthCues[i];
            if (currentAudioTime >= cue.start && currentAudioTime <= cue.end) {
              activeCue = cue;
              break;
            }
          }

          // Apply the active cue with transition
          if (activeCue) {
            const viseme =
              phonemeToViseme[activeCue.value] || phonemeToViseme.X;
            appliedMorphTargets.push(viseme);

            // Calculate transition progress with improved easing
            const cueProgress = Math.min(
              1.0,
              Math.max(
                0.0,
                (currentAudioTime - activeCue.start) /
                  (activeCue.end - activeCue.start),
              ),
            );

            // Smoother easing function for more natural mouth movement
            const easedProgress = 0.8 - Math.cos(cueProgress * Math.PI) / 2.5;

            // Apply viseme with dynamic interpolation - higher intensity for better visibility
            lerpMorphTarget(viseme, easedProgress, 0.5);

            // Debug info in development mode
            if (process.env.NODE_ENV === "development") {
              console.log(
                `Lip sync: ${activeCue.value} (${viseme}) at ${currentAudioTime.toFixed(2)}s, progress: ${easedProgress.toFixed(2)}`,
              );
            }
          }
        }

        // Reset all visemes that aren't currently active with smoother transition
        Object.values(phonemeToViseme).forEach((viseme) => {
          if (!appliedMorphTargets.includes(viseme)) {
            lerpMorphTarget(viseme, 0, 0.2); // Slightly slower fade-out for smoother transitions
          }
        });
      }
    } else {
      // Reset all visemes when not speaking
      Object.values(phonemeToViseme).forEach((viseme) => {
        lerpMorphTarget(viseme, 0, 0.1);
      });
    }

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

  // const [setControls] = useControls("MorphTarget", () => {
  //   if (
  //     !nodes.EyeLeft.morphTargetDictionary ||
  //     !nodes.EyeLeft.morphTargetInfluences
  //   ) {
  //     return {};
  //   }

  //   return Object.assign(
  //     {},
  //     ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => ({
  //       [key]: {
  //         label: key,
  //         value: 0,
  //         min:
  //           nodes.EyeLeft.morphTargetDictionary &&
  //           nodes.EyeLeft.morphTargetInfluences &&
  //           nodes.EyeLeft.morphTargetInfluences[
  //             nodes.EyeLeft.morphTargetDictionary[key]
  //           ],
  //         max: 1,
  //         onChange: (val: number) => {
  //           if (setupMode) {
  //             lerpMorphTarget(key, val, 1);
  //           }
  //         },
  //       },
  //     })),
  //   );
  // });

  // useControls("FacialExpressions", {
  //   winkLeft: button(() => {
  //     setWinkLeft(true);
  //     setTimeout(() => setWinkLeft(false), 300);
  //   }),
  //   winkRight: button(() => {
  //     setWinkRight(true);
  //     setTimeout(() => setWinkRight(false), 300);
  //   }),
  //   animation: {
  //     value: animation,
  //     options: animations.map((a) => a.name),
  //     onChange: (value) => setAnimation(value),
  //   },
  //   facialExpression: {
  //     value: facialExpression,
  //     options: Object.keys(facialExpressions),
  //     onChange: (value) => setFacialExpression(value),
  //   },
  //   enableSetupMode: button(() => {
  //     setupMode = true;
  //   }),
  //   disableSetupMode: button(() => {
  //     setupMode = false;
  //   }),
  //   logMorphTargetValues: button(() => {
  //     if (
  //       !nodes.EyeLeft.morphTargetDictionary ||
  //       !nodes.EyeLeft.morphTargetInfluences
  //     )
  //       return;

  //     const emotionValues: Record<string, number> = {};
  //     Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
  //       if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
  //         return;
  //       }
  //       if (
  //         !nodes.EyeLeft.morphTargetInfluences ||
  //         !nodes.EyeLeft.morphTargetDictionary
  //       )
  //         return;

  //       const value =
  //         nodes.EyeLeft.morphTargetInfluences[
  //           nodes.EyeLeft.morphTargetDictionary[key]
  //         ];
  //       if (value > 0.01) {
  //         emotionValues[key] = value;
  //       }
  //     });
  //     console.log(JSON.stringify(emotionValues, null, 2));
  //   }),
  // });

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
