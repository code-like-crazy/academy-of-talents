import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { randFloatSpread } from "three/src/math/MathUtils.js";

const OFFSET_X = 35;
const RANDOMIZER_STRENGTH_POSITION = 0.42;
const RANDOMIZER_STRENGTH_SCALE = 1;

interface MovingItemProps {
  children: React.ReactNode;
  position?: [number, number, number];
  randomizePosition?: boolean;
  randomizeScale?: boolean;
  speed?: number;
}

export const MovingItem = ({
  children,
  position,
  randomizePosition,
  randomizeScale,
  speed,
}: MovingItemProps) => {
  const ref = useRef<THREE.Group>(null);
  const delta = speed ?? 0.05; // Speed of movement
  const initialX = position?.[0] ?? 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += delta;
      // Handle both positive and negative speeds
      if (delta > 0 && ref.current.position.x >= OFFSET_X) {
        ref.current.position.x = -OFFSET_X;
      } else if (delta < 0 && ref.current.position.x <= -OFFSET_X) {
        ref.current.position.x = OFFSET_X;
      }
    }
  });

  useEffect(() => {
    if (ref.current) {
      if (randomizePosition) {
        ref.current.position.x += randFloatSpread(RANDOMIZER_STRENGTH_POSITION);
        ref.current.position.z += randFloatSpread(RANDOMIZER_STRENGTH_POSITION);
      }
      if (randomizeScale) {
        ref.current.scale.x += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
        ref.current.scale.y += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
        ref.current.scale.z += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
      }
    }
  }, [randomizePosition, randomizeScale]);

  return (
    <group
      ref={ref}
      position={[initialX, position?.[1] ?? 0, position?.[2] ?? 0]}
    >
      {children}
    </group>
  );
};
