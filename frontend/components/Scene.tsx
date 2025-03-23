"use client";

import { Suspense } from "react";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Html,
  Loader,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { AvailableAvatars } from "@/config/avatars";

import { Avatar } from "./avatar";

type SceneProps = {
  type: AvailableAvatars;
};

export function Scene({ type }: SceneProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 7], fov: 30 }}
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
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[0, 2, 1]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <Avatar position={[0, -0.3, 5]} type={type} />
          <ContactShadows opacity={0.7} />
        </Suspense>
      </Canvas>
    </div>
  );
}
