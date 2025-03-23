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
  animation?: string; // Add animation prop
} & JSX.IntrinsicElements["group"];

export function Avatar({
  type,
  expression = "default",
  text = "",
  isSpeaking = false,
  currentMessage,
  animation,
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
  const [currentAnimation, setCurrentAnimation] = useState(
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

  // Update animation when animation prop changes
  useEffect(() => {
    if (animation && actions && actions[animation]) {
      setCurrentAnimation(animation);
    }
  }, [animation, actions]);

  // Map Rhubarb phonemes to morph targets
  // These mappings are based on the standard Rhubarb phoneme set
  // and the available morph targets in the avatar model
  const phonemeToMorphTargets: Record<string, Record<string, number>> = {
    A: { mouthOpen: 0.8, mouthStretchLeft: 0.4, mouthStretchRight: 0.4 }, // Vowel sound in "bat"
    B: { mouthClose: 0.8, mouthPucker: 0.3 }, // B, M, P sounds
    C: { mouthOpen: 1.0, mouthStretchLeft: 0.6, mouthStretchRight: 0.6 }, // Vowel sound in "bot"
    D: { mouthOpen: 0.7, mouthFunnel: 0.3 }, // D, T, N sounds
    E: { mouthOpen: 0.5, mouthSmileLeft: 0.3, mouthSmileRight: 0.3 }, // Vowel sound in "bet"
    F: { mouthOpen: 0.3, mouthLowerDownLeft: 0.5, mouthLowerDownRight: 0.5 }, // F, V sounds
    G: { mouthOpen: 0.4, mouthPucker: 0.5 }, // Vowel sound in "boot"
    H: { mouthOpen: 0.5, mouthDimpleLeft: 0.3, mouthDimpleRight: 0.3 }, // L, R sounds
    X: { mouthClose: 0.5 }, // Neutral/rest position
  };

  // Store audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update animation when currentMessage changes
  useEffect(() => {
    if (!actions) return;

    // If we have a current message with an animation specified, use that
    if (currentMessage?.animation && actions[currentMessage.animation]) {
      const newAnimation = currentMessage.animation;
      setCurrentAnimation(newAnimation);
      setFacialExpression(currentMessage.facialExpression || "default");
    } else if (!currentMessage && actions["Idle"]) {
      // Reset to Idle when no message is playing
      setCurrentAnimation("Idle");
    }
  }, [currentMessage, actions]);

  // Play the current animation
  useEffect(() => {
    if (!actions || !currentAnimation || !actions[currentAnimation]) return;

    // Stop all currently running animations
    Object.values(actions).forEach((action) => {
      if (action && action.isRunning()) {
        action.fadeOut(0.5);
      }
    });

    // Play the new animation
    const action = actions[currentAnimation];
    if (action) {
      action.reset().fadeIn(0.5).play();

      return () => {
        action.fadeOut(0.5);
      };
    }
  }, [currentAnimation, actions]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.5) => {
    let applied = false;
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

      // Only log significant changes to avoid console spam
      const currentValue = skinnedMesh.morphTargetInfluences[index];
      const newValue = THREE.MathUtils.lerp(currentValue, value, speed);

      if (Math.abs(currentValue - newValue) > 0.05) {
        console.log(
          `Applying morph target: ${target}, value: ${newValue.toFixed(2)}`,
        );
      }

      skinnedMesh.morphTargetInfluences[index] = newValue;
      applied = true;

      // if (!setupMode) {
      //   try {
      //     // Only try to update Leva controls if they exist
      //     if (typeof setControls === "function") {
      //       setControls({
      //         [target]: value,
      //       });
      //     }
      //   } catch {
      //     // Ignore errors when setting control values
      //   }
      // }
    });
  };

  // Handle audio playback for lip sync
  useEffect(() => {
    if (!currentMessage?.audio) {
      console.log("No audio data in current message, skipping lip sync setup");
      return;
    }

    console.log("Setting up lip sync with current message:", {
      hasAudio: !!currentMessage.audio,
      hasLipSync: !!currentMessage.lipsync,
      mouthCuesCount: currentMessage.lipsync?.mouthCues?.length || 0,
    });

    // Debug: Log the full lipsync data structure
    if (currentMessage.lipsync) {
      console.log(
        "Full lipsync data structure:",
        JSON.stringify(currentMessage.lipsync, null, 2),
      );
    } else {
      console.error("Missing lipsync data in currentMessage");
    }

    // Create or reset audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // Configure audio settings for better lip sync
    audio.preload = "auto";
    audio.playbackRate = 1.0;

    // Log lip sync data for debugging
    if (currentMessage?.lipsync?.mouthCues) {
      console.log(
        `Lip sync data loaded with ${currentMessage.lipsync.mouthCues.length} mouth cues`,
      );
      if (currentMessage.lipsync.metadata) {
        console.log(
          `Audio duration from metadata: ${currentMessage.lipsync.metadata.duration}s`,
        );
      }

      // Log the first few mouth cues for debugging
      if (currentMessage.lipsync.mouthCues.length > 0) {
        console.log(
          "First few mouth cues:",
          currentMessage.lipsync.mouthCues
            .slice(0, 5)
            .map(
              (cue) =>
                `${cue.value} (${cue.start.toFixed(2)}s - ${cue.end.toFixed(2)}s)`,
            ),
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
          console.log("Found onMessagePlayed callback in userData, calling it");
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
            console.log(
              "Found onMessagePlayed callback in child userData, calling it",
            );
            child.userData.onMessagePlayed();
            found = true;
          }
        });

        return found;
      };

      if (currentMessage) {
        const callbackFound = findAndCallCallback(group.current);
        if (!callbackFound) {
          console.warn("onMessagePlayed callback not found in any userData");
        }
      }
    };

    // Set up audio element
    audio.src = `data:audio/mp3;base64,${currentMessage.audio}`;
    audio.oncanplay = handleCanPlay;
    audio.onended = handleAudioEnd;

    // Add timeupdate event for debugging
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

    // Handle errors
    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      handleAudioEnd(); // Ensure message completion even if audio fails
    };

    // Start playing as soon as possible
    if (audio.readyState >= 2) {
      // HAVE_CURRENT_DATA or higher
      handleCanPlay();
    }

    // Cleanup function
    return () => {
      audio.oncanplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.ontimeupdate = null;
      audio.pause();
      audio.src = "";
    };
  }, [currentMessage, isSpeaking]);

  // Debug state to track available morph targets
  const [availableMorphTargets, setAvailableMorphTargets] = useState<string[]>(
    [],
  );

  // Collect available morph targets for debugging
  useEffect(() => {
    if (!scene) return;

    const morphTargets: string[] = [];
    scene.traverse((child) => {
      const skinnedMesh = child as THREE.SkinnedMesh;
      if (skinnedMesh.isSkinnedMesh && skinnedMesh.morphTargetDictionary) {
        Object.keys(skinnedMesh.morphTargetDictionary).forEach((key) => {
          if (!morphTargets.includes(key)) {
            morphTargets.push(key);
          }
        });
      }
    });

    setAvailableMorphTargets(morphTargets);
    console.log("Available morph targets:", morphTargets);
  }, [scene]);

  useFrame(() => {
    // LIPSYNC
    // if (setupMode) {
    //   return;
    // }

    // Handle Rhubarb lip sync data if available
    const appliedMorphs: Record<string, boolean> = {};

    if (currentMessage?.lipsync?.mouthCues && isSpeaking && audioRef.current) {
      if (!audioRef.current.paused && !isNaN(audioRef.current.duration)) {
        const currentAudioTime = audioRef.current.currentTime;
        const mouthCues = currentMessage.lipsync.mouthCues;

        // Debug: Log lip sync status every second
        if (Math.floor(currentAudioTime * 10) % 10 === 0) {
          console.log(
            `Lip sync active: audio time ${currentAudioTime.toFixed(2)}s, mouth cues: ${mouthCues.length}`,
          );
        }

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

          // Debug: Log when no active cue is found
          if (!activeCue && Math.floor(currentAudioTime * 10) % 10 === 0) {
            console.log(
              `No active mouth cue found at time ${currentAudioTime.toFixed(2)}s`,
            );
            // Log the first few cues for debugging
            console.log(
              "Available cues:",
              mouthCues
                .slice(0, 5)
                .map(
                  (cue) =>
                    `${cue.value} (${cue.start.toFixed(2)}s - ${cue.end.toFixed(2)}s)`,
                ),
            );
          }

          // Apply the active cue with transition
          if (activeCue) {
            const phoneme = activeCue.value;
            const morphTargets =
              phonemeToMorphTargets[phoneme] || phonemeToMorphTargets.X;

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

            // Apply all morph targets for this phoneme
            Object.entries(morphTargets).forEach(([morphName, intensity]) => {
              // Check if this morph target exists in the available morph targets
              if (availableMorphTargets.includes(morphName)) {
                const value = intensity * easedProgress;
                lerpMorphTarget(morphName, value, 0.5);
                appliedMorphs[morphName] = true;
              } else {
                // Try alternative morph target names
                const alternatives = [
                  // Common variations of morph target names
                  morphName.toLowerCase(),
                  morphName.toUpperCase(),
                  `viseme_${morphName}`,
                  `viseme${morphName}`,
                  `mouth${morphName}`,
                ];

                for (const alt of alternatives) {
                  if (availableMorphTargets.includes(alt)) {
                    const value = intensity * easedProgress;
                    lerpMorphTarget(alt, value, 0.5);
                    appliedMorphs[alt] = true;
                    break;
                  }
                }
              }
            });

            // Fallback: If no specific morph targets were applied, use generic mouth open/close
            if (Object.keys(appliedMorphs).length === 0) {
              // Try to find any mouth-related morph targets
              const mouthMorphs = availableMorphTargets.filter(
                (name) =>
                  name.toLowerCase().includes("mouth") ||
                  name.toLowerCase().includes("viseme"),
              );

              if (mouthMorphs.length > 0) {
                // Use the first found mouth morph with intensity based on phoneme
                const openAmount =
                  phoneme === "X"
                    ? 0.1
                    : ["A", "C", "D", "E"].includes(phoneme)
                      ? 0.8
                      : 0.4;

                mouthMorphs.forEach((morphName) => {
                  if (morphName.toLowerCase().includes("open")) {
                    lerpMorphTarget(morphName, openAmount * easedProgress, 0.5);
                    appliedMorphs[morphName] = true;
                  }
                });
              }
            }

            // Debug info
            console.log(
              `Lip sync: ${phoneme} at ${currentAudioTime.toFixed(2)}s, progress: ${easedProgress.toFixed(2)}, applied: ${Object.keys(appliedMorphs).join(", ")}`,
            );
          }
        }

        // Reset all mouth-related morph targets that aren't currently active
        availableMorphTargets
          .filter(
            (name) =>
              (name.toLowerCase().includes("mouth") ||
                name.toLowerCase().includes("viseme")) &&
              !appliedMorphs[name],
          )
          .forEach((name) => {
            lerpMorphTarget(name, 0, 0.2); // Slightly slower fade-out for smoother transitions
          });
      }
    } else {
      // Reset all mouth-related morph targets when not speaking
      availableMorphTargets
        .filter(
          (name) =>
            name.toLowerCase().includes("mouth") ||
            name.toLowerCase().includes("viseme"),
        )
        .forEach((name) => {
          lerpMorphTarget(name, 0, 0.1);
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
  //     value: currentAnimation,
  //     options: animations.map((a) => a.name),
  //     onChange: (value) => setCurrentAnimation(value),
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

  // Set up the onMessagePlayed callback in userData
  useEffect(() => {
    if (group.current && props.userData?.onMessagePlayed) {
      console.log("Setting up onMessagePlayed callback in userData");
      group.current.userData = {
        ...group.current.userData,
        onMessagePlayed: props.userData.onMessagePlayed,
      };
    } else if (group.current) {
      console.log(
        "No onMessagePlayed callback found in props.userData:",
        props.userData,
      );
    }
  }, [props.userData, group]);

  return (
    <group ref={group} {...props} dispose={null}>
      <AvatarComponent nodes={nodes} materials={materials} />
    </group>
  );
}

useGLTF.preload("/models/avatars/teacher.glb");
useGLTF.preload("/models/animations/teacher-animations.glb");
