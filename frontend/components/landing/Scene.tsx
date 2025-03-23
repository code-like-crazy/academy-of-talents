import { Canvas } from "@react-three/fiber";
import { LandingExperience } from "./LandingExperience";

interface SceneProps {
  isZooming: boolean;
  onAnimationComplete: () => void;
}

export const Scene = ({ isZooming, onAnimationComplete }: SceneProps) => {
  return (
    <Canvas style={{ background: "#87CEEB" }}>
      <LandingExperience isZooming={isZooming} onAnimationComplete={onAnimationComplete} />
      <fog attach="fog" args={["#87CEEB", 12, 30]} />
    </Canvas>
  );
}; 