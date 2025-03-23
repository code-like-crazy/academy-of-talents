import { useGLTF } from "@react-three/drei";

interface TrainProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  'rotation-y'?: number;
}

const Train = ({ position, scale, rotation, 'rotation-y': rotationY }: TrainProps) => {
  const { scene } = useGLTF("/models/train.glb");
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

export default Train; 