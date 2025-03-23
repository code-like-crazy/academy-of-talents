import { useGLTF } from "@react-three/drei";

interface BusProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  'rotation-y'?: number;
}

const Bus = ({ position, scale, rotation, 'rotation-y': rotationY }: BusProps) => {
  const { scene } = useGLTF("/models/bus.glb");
  return (
    <primitive 
      object={scene} 
      scale={scale ?? [1, 1, 1]} 
      position={position} 
      rotation={rotation} 
      rotation-y={rotationY} 
    />
  );
};

export default Bus; 