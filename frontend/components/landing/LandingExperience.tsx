import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils } from "three";
import * as THREE from "three";
import { Background } from "./Background";
import Duck from "../graphs/Duck";

interface LandingExperienceProps {
  isZooming: boolean;
  onAnimationComplete: () => void;
}

export const LandingExperience = ({ isZooming, onAnimationComplete }: LandingExperienceProps) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (isZooming && camera && controlsRef.current) {
      // Disable controls during animation
      controlsRef.current.enabled = false;
      
      // Animate camera position and target
      const startPosition = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      
      // Adjust these values to get a better view of the duck's face
      const endPosition = new THREE.Vector3(0.4, 0.1, 0.6);
      const endTarget = new THREE.Vector3(0.9, 0.1, -0.5);
      
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        camera.position.lerpVectors(startPosition, endPosition, easeProgress);
        controlsRef.current.target.lerpVectors(startTarget, endTarget, easeProgress);
        controlsRef.current.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Re-enable controls after animation
          controlsRef.current.enabled = true;
          // Notify parent that animation is complete
          setTimeout(onAnimationComplete, 2000); // Wait 2 seconds before calling onAnimationComplete
        }
      };

      animate();
    }
  }, [isZooming, camera, onAnimationComplete]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        minAzimuthAngle={MathUtils.degToRad(-45)}
        maxAzimuthAngle={MathUtils.degToRad(45)}
        minPolarAngle={MathUtils.degToRad(45)}
        maxPolarAngle={MathUtils.degToRad(90)}
        minDistance={1}
        maxDistance={8}
      />
      <ambientLight intensity={0.2} />
      <Environment preset="sunset" blur={0.8} />
      <group position={[0, -1, 0]}>
        <Background />
        <Duck
          rotation-y={MathUtils.degToRad(270)}
          position={[2, 0, -0.5]}
          scale={[0.5, 0.5, 0.5]}
        />
        <ContactShadows scale={[16, 16]} opacity={0.42} />
      </group>
    </>
  );
}; 