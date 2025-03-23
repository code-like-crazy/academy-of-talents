import { useGLTF } from "@react-three/drei";

interface GrassSliceProps {
  position?: [number, number, number];
  scale?: [number, number, number];
}

const GrassSlice = ({ position, scale }: GrassSliceProps) => {
  const { scene } = useGLTF("/models/grass_slice.glb");
  return <primitive object={scene} scale={scale ?? [1, 1, 1]} position={position} />;
};

export default GrassSlice; 