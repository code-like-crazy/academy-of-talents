import { useGLTF } from "@react-three/drei";

interface RoadBlockProps {
  position?: [number, number, number];
  scale?: [number, number, number];
}

const RoadBlock = ({ position, scale }: RoadBlockProps) => {
  const { scene } = useGLTF("/models/road_block.glb");
  return <primitive object={scene} scale={scale ?? [0.5, 0.5, 0.5]} position={position} />;
};

export default RoadBlock; 