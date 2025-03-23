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

  // Refined phoneme to morph target mappings for more natural lip sync
  // These mappings are based on the standard Rhubarb phoneme set
  // and the available morph targets in the avatar model
  const phonemeToMorphTargets: Record<string, Record<string, number>> = {
    A: {
      mouthOpen: 0.6, // Reduced from 0.9
      mouthStretchLeft: 0.4, // Reduced from 0.5
      mouthStretchRight: 0.4, // Reduced from 0.5
      jawOpen: 0.5, // Reduced from 0.7
    }, // Vowel sound in "bat"

    B: {
      mouthClose: 0.7, // Reduced from 0.9
      mouthPucker: 0.2,
      mouthPressLeft: 0.4, // Reduced from 0.6
      mouthPressRight: 0.4, // Reduced from 0.6
      // Removed any morph targets that might cause the lower lip to move up
    }, // B, M, P sounds

    C: {
      mouthOpen: 0.7, // Reduced from 1.0
      mouthStretchLeft: 0.5, // Reduced from 0.7
      mouthStretchRight: 0.5, // Reduced from 0.7
      jawOpen: 0.6, // Reduced from 0.8
    }, // Vowel sound in "bot"

    D: {
      mouthOpen: 0.4, // Reduced from 0.6
      mouthFunnel: 0.2, // Reduced from 0.3
      tongueOut: 0.1, // Reduced from 0.3
      jawOpen: 0.3, // Reduced from 0.4
    }, // D, T, N sounds

    E: {
      mouthOpen: 0.4, // Reduced from 0.5
      mouthSmileLeft: 0.3, // Reduced from 0.4
      mouthSmileRight: 0.3, // Reduced from 0.4
      mouthStretchLeft: 0.2, // Reduced from 0.3
      mouthStretchRight: 0.2, // Reduced from 0.3
    }, // Vowel sound in "bet"

    F: {
      mouthOpen: 0.2, // Reduced from 0.3
      // Removed mouthLowerDownLeft and mouthLowerDownRight as these might be causing the issue
      jawForward: 0.2,
      mouthPressLeft: 0.3, // Added as alternative to mouthLowerDown
      mouthPressRight: 0.3, // Added as alternative to mouthLowerDown
    }, // F, V sounds

    G: {
      mouthOpen: 0.3, // Reduced from 0.4
      mouthPucker: 0.5, // Reduced from 0.7
      // Removed mouthRollLower as it might be causing the issue
      mouthRollUpper: 0.1, // Reduced from 0.2
    }, // Vowel sound in "boot"

    H: {
      mouthOpen: 0.4, // Reduced from 0.5
      mouthDimpleLeft: 0.3, // Reduced from 0.4
      mouthDimpleRight: 0.3, // Reduced from 0.4
      tongueOut: 0.1, // Reduced from 0.2
    }, // L, R sounds

    X: {
      mouthClose: 0.6, // Reduced from 0.8
      mouthSmileLeft: 0.05, // Reduced from 0.1
      mouthSmileRight: 0.05, // Reduced from 0.1
    }, // Neutral/rest position
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

  // Improved lerp function for smoother transitions between morph targets
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

      // Apply smoother easing for more natural transitions
      const currentValue = skinnedMesh.morphTargetInfluences[index];

      // Use a cubic easing function for more natural mouth movements
      // This creates a more organic feel to the transitions
      const t = Math.min(1.0, speed);
      const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const newValue = currentValue + (value - currentValue) * easedT;

      // Only log significant changes to avoid console spam
      if (Math.abs(currentValue - newValue) > 0.05) {
        console.log(
          `Applying morph target: ${target}, value: ${newValue.toFixed(2)}`,
        );
      }

      skinnedMesh.morphTargetInfluences[index] = newValue;
      applied = true;
    });

    return applied;
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

  // Store the previous active cue for smoother transitions
  const prevActiveCueRef = useRef<{ phoneme: string; end: number } | null>(
    null,
  );

  // Store the last applied morph values for smoother interpolation
  const lastAppliedMorphsRef = useRef<Record<string, number>>({});

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
          // Find the current mouth cue based on time with lookahead
          let activeCue = null;
          let nextCue = null;

          // Add a small offset (50ms) to the current time for better synchronization
          // This helps compensate for any processing delays
          const adjustedTime = currentAudioTime + 0.05;

          for (let i = 0; i < mouthCues.length; i++) {
            const cue = mouthCues[i];
            if (adjustedTime >= cue.start && adjustedTime <= cue.end) {
              activeCue = cue;
              // Look ahead for the next cue for better transitions
              if (i < mouthCues.length - 1) {
                nextCue = mouthCues[i + 1];
              }
              break;
            }
          }

          // If no active cue found but we have a previous cue, check if we're in a short gap
          if (!activeCue && prevActiveCueRef.current) {
            // Find the next cue after the previous one
            const prevIndex = mouthCues.findIndex(
              (cue) => cue.end === prevActiveCueRef.current?.end,
            );

            if (prevIndex >= 0 && prevIndex < mouthCues.length - 1) {
              const nextCueAfterPrev = mouthCues[prevIndex + 1];

              // If we're in a small gap (less than 100ms), interpolate between cues
              if (
                nextCueAfterPrev.start - prevActiveCueRef.current.end < 0.1 &&
                currentAudioTime < nextCueAfterPrev.start
              ) {
                // Create a virtual cue for the gap
                activeCue = {
                  value: prevActiveCueRef.current.phoneme,
                  start: prevActiveCueRef.current.end,
                  end: nextCueAfterPrev.start,
                  sustain: false,
                };
              }
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

          // Apply the active cue with improved transitions
          if (activeCue) {
            const phoneme = activeCue.value;
            const morphTargets =
              phonemeToMorphTargets[phoneme] || phonemeToMorphTargets.X;

            // Calculate transition progress with improved easing
            const cueProgress = Math.min(
              1.0,
              Math.max(
                0.0,
                (adjustedTime - activeCue.start) /
                  (activeCue.end - activeCue.start),
              ),
            );

            // Improved easing function for more natural mouth movement
            // This creates a bell curve that emphasizes the middle of each phoneme
            const easedProgress = Math.sin(cueProgress * Math.PI) * 0.8 + 0.2;

            // Calculate blend factor for transition to next phoneme
            let nextPhonemeBlend = 0;
            if (nextCue && activeCue.end === nextCue.start) {
              // If we're close to the end of the current cue, start blending with the next one
              const transitionWindow = 0.05; // 50ms transition window
              const timeToNextCue = activeCue.end - adjustedTime;

              if (timeToNextCue < transitionWindow) {
                nextPhonemeBlend = 1 - timeToNextCue / transitionWindow;
              }
            }

            // Store this cue as the previous one for the next frame
            prevActiveCueRef.current = {
              phoneme,
              end: activeCue.end,
            };

            // Apply all morph targets for this phoneme with improved blending
            Object.entries(morphTargets).forEach(([morphName, intensity]) => {
              // Calculate the final intensity with easing
              let finalIntensity = intensity * easedProgress;

              // Blend with next phoneme if needed
              if (nextPhonemeBlend > 0 && nextCue) {
                const nextPhoneme = nextCue.value;
                const nextMorphTargets =
                  phonemeToMorphTargets[nextPhoneme] || phonemeToMorphTargets.X;

                if (nextMorphTargets[morphName] !== undefined) {
                  finalIntensity = THREE.MathUtils.lerp(
                    finalIntensity,
                    nextMorphTargets[morphName],
                    nextPhonemeBlend,
                  );
                }
              }

              // Apply the morph target if it exists
              if (availableMorphTargets.includes(morphName)) {
                // Use a faster transition speed for more responsive lip sync
                const applied = lerpMorphTarget(morphName, finalIntensity, 0.7);
                if (applied) {
                  appliedMorphs[morphName] = true;
                  lastAppliedMorphsRef.current[morphName] = finalIntensity;
                }
              } else {
                // Try alternative morph target names with improved matching
                const alternatives = [
                  // Common variations of morph target names
                  morphName.toLowerCase(),
                  morphName.toUpperCase(),
                  `viseme_${morphName}`,
                  `viseme${morphName}`,
                  `mouth${morphName}`,
                  // Additional variations for better compatibility
                  `${morphName.charAt(0).toUpperCase()}${morphName.slice(1)}`,
                  morphName.replace("mouth", "Mouth"),
                ];

                for (const alt of alternatives) {
                  if (availableMorphTargets.includes(alt)) {
                    const applied = lerpMorphTarget(alt, finalIntensity, 0.7);
                    if (applied) {
                      appliedMorphs[alt] = true;
                      lastAppliedMorphsRef.current[alt] = finalIntensity;
                      break;
                    }
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
                  name.toLowerCase().includes("viseme") ||
                  name.toLowerCase().includes("jaw"),
              );

              if (mouthMorphs.length > 0) {
                // Use more sophisticated fallback based on phoneme type with reduced intensities
                const isOpenPhoneme = ["A", "C", "E"].includes(phoneme);
                const isClosedPhoneme = ["B", "D", "F", "X"].includes(phoneme);
                const isPuckeredPhoneme = ["G"].includes(phoneme);

                mouthMorphs.forEach((morphName) => {
                  let value = 0;

                  // Avoid any morph targets that might cause the lower lip to move up unnaturally
                  const lowerName = morphName.toLowerCase();
                  const isLowerLipUpMorph =
                    lowerName.includes("lower") &&
                    (lowerName.includes("up") || lowerName.includes("raise"));

                  if (isLowerLipUpMorph) {
                    // Skip morphs that might cause the lower lip to move up
                    return;
                  }

                  if (lowerName.includes("open") && isOpenPhoneme) {
                    value = 0.5 * easedProgress; // Reduced from 0.8
                  } else if (lowerName.includes("close") && isClosedPhoneme) {
                    value = 0.5 * easedProgress; // Reduced from 0.8
                  } else if (
                    lowerName.includes("pucker") &&
                    isPuckeredPhoneme
                  ) {
                    value = 0.4 * easedProgress; // Reduced from 0.8
                  } else if (lowerName.includes("jaw") && isOpenPhoneme) {
                    value = 0.4 * easedProgress; // Reduced from 0.6
                  }

                  if (value > 0) {
                    const applied = lerpMorphTarget(morphName, value, 0.7);
                    if (applied) {
                      appliedMorphs[morphName] = true;
                      lastAppliedMorphsRef.current[morphName] = value;
                    }
                  }
                });
              }
            }

            // Only log detailed info occasionally to reduce console spam
            if (Math.floor(currentAudioTime * 20) % 20 === 0) {
              console.log(
                `Lip sync: ${phoneme} at ${adjustedTime.toFixed(2)}s, progress: ${easedProgress.toFixed(2)}, applied: ${Object.keys(appliedMorphs).join(", ")}`,
              );
            }
          }
        }

        // Gradually reset all mouth-related morph targets that aren't currently active
        // This creates smoother transitions between phonemes
        availableMorphTargets
          .filter(
            (name) =>
              (name.toLowerCase().includes("mouth") ||
                name.toLowerCase().includes("viseme") ||
                name.toLowerCase().includes("jaw") ||
                name.toLowerCase().includes("tongue")) &&
              !appliedMorphs[name],
          )
          .forEach((name) => {
            // Use a slower fade-out for smoother transitions between phonemes
            // This prevents abrupt mouth movements
            if (lastAppliedMorphsRef.current[name] > 0) {
              // Gradually reduce the value instead of immediately setting to 0
              const newValue = lastAppliedMorphsRef.current[name] * 0.8;

              if (newValue > 0.01) {
                lerpMorphTarget(name, newValue, 0.3);
                lastAppliedMorphsRef.current[name] = newValue;
                appliedMorphs[name] = true;
              } else {
                lerpMorphTarget(name, 0, 0.3);
                delete lastAppliedMorphsRef.current[name];
              }
            } else {
              lerpMorphTarget(name, 0, 0.3);
            }
          });
      }
    } else {
      // Reset all mouth-related morph targets when not speaking
      // Use a slower transition for more natural movement
      availableMorphTargets
        .filter(
          (name) =>
            name.toLowerCase().includes("mouth") ||
            name.toLowerCase().includes("viseme") ||
            name.toLowerCase().includes("jaw") ||
            name.toLowerCase().includes("tongue"),
        )
        .forEach((name) => {
          lerpMorphTarget(name, 0, 0.2);
          delete lastAppliedMorphsRef.current[name];
        });

      // Reset the previous cue reference
      prevActiveCueRef.current = null;
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
