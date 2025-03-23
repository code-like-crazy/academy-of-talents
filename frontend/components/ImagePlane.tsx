import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface ImagePlaneProps {
    imageUrl: string;
    position?: [number, number, number];
    scale?: [number, number, number];
    rotation?: [number, number, number];
}

export const ImagePlane = ({ 
    imageUrl, 
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0]
}: ImagePlaneProps) => {
    const texture = useTexture(imageUrl);
    const meshRef = useRef<THREE.Mesh>(null);

    // Optional: Add some animation or interaction
    useFrame((state) => {
        if (meshRef.current) {
            // Add subtle floating animation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            rotation={rotation}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
                map={texture}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}; 