"use client";

import { useEffect, useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const SimpleAvatar = ({
  modelPath,
  position,
}: {
  modelPath: string;
  position: [number, number, number];
}) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} position={position} />;
};

const CameraController = () => {
  const { camera, gl } = useThree();
  const [moveSpeed] = useState(0.1);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    // Get forward and right vectors from camera
    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up);

    // Remove vertical movement from forward vector
    forward.y = 0;
    forward.normalize();
    right.normalize();

    if (keys.current["w"])
      camera.position.add(forward.multiplyScalar(moveSpeed));
    if (keys.current["s"])
      camera.position.sub(forward.multiplyScalar(moveSpeed));
    if (keys.current["a"]) camera.position.sub(right.multiplyScalar(moveSpeed));
    if (keys.current["d"]) camera.position.add(right.multiplyScalar(moveSpeed));
  });

  return null;
};

const Assemble = () => {
  return (
    <div className="h-screen w-full">
      <div className="absolute top-4 left-4 rounded-lg bg-black/50 p-4 text-white">
        <p>Controls:</p>
        <p>WASD - Move camera</p>
        <p>Left Click + Drag - Rotate view</p>
        <p>Right Click + Drag - Pan</p>
        <p>Scroll - Zoom</p>
      </div>
      <Canvas camera={{ position: [0, 1.5, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <SimpleAvatar
          modelPath="/models/avatars/aria.glb"
          position={[-6, -1, 0]}
        />
        <SimpleAvatar
          modelPath="/models/avatars/leo.glb"
          position={[-2, -1, 0]}
        />
        <SimpleAvatar
          modelPath="/models/avatars/rex.glb"
          position={[2, -1, 0]}
        />
        <SimpleAvatar
          modelPath="/models/avatars/teacher.glb"
          position={[6, -1, 0]}
        />
        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
          screenSpacePanning={false}
          maxPolarAngle={Math.PI / 2}
        />
        <CameraController />
      </Canvas>
    </div>
  );
};

export default Assemble;

// Preload models
useGLTF.preload("/models/avatars/aria.glb");
useGLTF.preload("/models/avatars/leo.glb");
useGLTF.preload("/models/avatars/rex.glb");
useGLTF.preload("/models/avatars/teacher.glb");
