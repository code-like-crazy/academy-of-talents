"use client";

import { Suspense, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Html,
  Loader,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { AvailableAvatars } from "@/config/avatars";
import { Avatar } from "@/components/avatar";
import { ChatMessage } from "@/components/avatar/hooks/useChat";

import { SceneCanvasProps } from "./types";

type AnimatedAvatarProps = {
  position: [number, number, number];
  type: AvailableAvatars;
  expression?: string;
  text?: string;
  isSpeaking?: boolean;
  currentMessage?: ChatMessage | null;
};

function AnimatedAvatar({
  position,
  type,
  expression,
  text,
  isSpeaking,
  currentMessage,
}: AnimatedAvatarProps) {
  const { position: springPosition } = useSpring({
    position,
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const groupRef = useRef<THREE.Group>(null);

  return (
    <animated.group position={springPosition} ref={groupRef}>
      <Avatar
        type={type}
        expression={expression}
        text={text}
        isSpeaking={isSpeaking}
        currentMessage={currentMessage}
      />
    </animated.group>
  );
}

export function SceneCanvas({
  type,
  expression = "default",
  text = "",
  isSpeaking = false,
  avatarZoom,
  currentMessage,
  onMessagePlayed,
}: SceneCanvasProps) {
  // Reference to the animated avatar group
  const avatarGroupRef = useRef<THREE.Group>(null);

  // Store the onMessagePlayed callback in the userData of the avatar group
  useEffect(() => {
    if (avatarGroupRef.current && onMessagePlayed) {
      // Store the callback in the userData of the group
      avatarGroupRef.current.userData.onMessagePlayed = onMessagePlayed;

      // Also store it in all child groups to ensure it's accessible
      avatarGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Group) {
          child.userData.onMessagePlayed = onMessagePlayed;
        }
      });
    }
  }, [onMessagePlayed]);
  // Handle message completion
  useEffect(() => {
    if (!currentMessage) return;

    // Set a timeout to call onMessagePlayed after a reasonable time
    // This is a fallback in case the audio playback in the Avatar component fails
    const messageTimeout = setTimeout(() => {
      if (onMessagePlayed) {
        onMessagePlayed();
      }
    }, 10000); // 10 seconds timeout as fallback

    return () => clearTimeout(messageTimeout);
  }, [currentMessage, onMessagePlayed]);
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 7], fov: 25 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: true,
      }}
      dpr={[1, 2]} // Cap pixel ratio for better performance
      performance={{
        min: 0.5, // Allow frame rate to drop to 30 FPS before intervention
      }}
    >
      <Suspense
        fallback={
          <Html center>
            <Loader
              containerStyles={{
                background: "transparent",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "200px",
                zIndex: 1,
              }}
              innerStyles={{
                background: "rgba(0, 0, 0, 1)",
                padding: "12px 24px",
                borderRadius: "8px",
              }}
              barStyles={{
                backgroundColor: "white",
                height: "3px",
              }}
              dataStyles={{
                color: "white",
                fontSize: "14px",
                fontWeight: "normal",
              }}
            />
          </Html>
        }
      >
        <CameraControls
          makeDefault
          minDistance={1}
          maxDistance={6}
          truckSpeed={0}
          dollySpeed={0.3}
          azimuthRotateSpeed={0.3}
          polarRotateSpeed={0}
          mouseButtons={{
            left: 0,
            middle: 0,
            right: 1,
            wheel: 2,
          }}
        />
        <Environment preset="sunset" resolution={256} />
        <ambientLight intensity={1} />
        <directionalLight
          position={[0, 2, 1]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <group ref={avatarGroupRef}>
          <AnimatedAvatar
            position={avatarZoom}
            type={type}
            expression={expression}
            text={text}
            isSpeaking={isSpeaking}
            currentMessage={currentMessage}
          />
        </group>
        <ContactShadows opacity={0.7} />
      </Suspense>
    </Canvas>
  );
}
