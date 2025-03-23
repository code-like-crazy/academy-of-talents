"use client"
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import * as THREE from "three";
import { useControls } from "leva";
import Taxi from "./graphs/Taxi";
import TreeLime from "./graphs/TreeLime";
import Duck from "./graphs/Duck";
import TreeBeech from "./graphs/TreeBeech";
import TruckFlat from "./graphs/TruckFlat";
import Tree from "./graphs/Tree";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import { useGLTF } from "@react-three/drei";
import { Experience } from "./Experience";

const OFFSET_X = 35;
const ROAD_BLOCK_WIDTH = 2; // Approximate width of each road block
const ROAD_BLOCKS_NUMBER = Math.ceil(OFFSET_X * 2 / ROAD_BLOCK_WIDTH) + 2; // Number of blocks needed to cover the view
const TREES_NUMBER = 10;
const TREES_SPEED = 0.03;
const RANDOMIZER_STRENGTH_POSITION = 0.42;
const RANDOMIZER_STRENGTH_SCALE = 1;

const MovingItem = (props: { 
    children: React.ReactNode; 
    position?: [number, number, number];
    randomizePosition?: boolean;
    randomizeScale?: boolean;
    speed?: number;
}) => {
    const ref = useRef<THREE.Group>(null);
    const delta = props.speed ?? 0.05; // Speed of movement
    const initialX = props.position?.[0] ?? 0;

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
            if (props.randomizePosition) {
                ref.current.position.x += randFloatSpread(RANDOMIZER_STRENGTH_POSITION);
                ref.current.position.z += randFloatSpread(RANDOMIZER_STRENGTH_POSITION);
            }
            if (props.randomizeScale) {
                ref.current.scale.x += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
                ref.current.scale.y += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
                ref.current.scale.z += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
            }
        }
    }, []);

    return <group ref={ref} position={[initialX, props.position?.[1] ?? 0, props.position?.[2] ?? 0]}>{props.children}</group>
};

function RoadBlock(props: { position?: [number, number, number]; scale?: [number, number, number] }) {
  const { scene } = useGLTF("/models/road_block.glb");
  return <primitive object={scene} scale={props.scale ?? [0.5, 0.5, 0.5]} position={props.position} />;
}

function GrassSlice(props: { position?: [number, number, number]; scale?: [number, number, number] }) {
  const { scene } = useGLTF("/models/grass_slice.glb");
  return <primitive object={scene} scale={props.scale ?? [1, 1, 1]} position={props.position} />;
}

function Bus(props: { 
  position?: [number, number, number]; 
  scale?: [number, number, number]; 
  rotation?: [number, number, number];
  'rotation-y'?: number;
}) {
  const { scene } = useGLTF("/models/bus.glb");
  return <primitive object={scene} scale={props.scale ?? [1, 1, 1]} position={props.position} rotation={props.rotation} rotation-y={props['rotation-y']} />;
}

function Train(props: { 
  position?: [number, number, number]; 
  scale?: [number, number, number]; 
  rotation?: [number, number, number];
  'rotation-y'?: number;
}) {
  const { scene } = useGLTF("/models/train.glb");
  return <primitive object={scene} scale={props.scale ?? [1, 1, 1]} position={props.position} rotation={props.rotation} rotation-y={props['rotation-y']} />;
}

const Background = () => {
  const ref = useRef<THREE.Group>(null);

  const {treesNumber, treesSpeed} = {treesNumber: TREES_NUMBER, treesSpeed: TREES_SPEED}
  const vehicleSpeed = -0.05; // Negative speed to move left

  return (
    <><group position={[0, 0, -5]} ref={ref}>
      {[...Array(treesNumber)].map((_v, index) => (
        <MovingItem
          key={index}
          speed={treesSpeed}
          position={[-OFFSET_X + (index / treesNumber) * OFFSET_X * 2, 0, -1.5]}
          randomizePosition={true}
          randomizeScale={true}
        >
          <TreeBeech scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
        </MovingItem>
      ))}

      {[...Array(treesNumber)].map((_v, index) => (
        <MovingItem
          key={index}
          speed={treesSpeed}
          position={[-OFFSET_X + (index / treesNumber) * OFFSET_X * 2, 0, -2.5]}
          randomizePosition={true}
          randomizeScale={true}
        >
          <TreeLime scale={[0.3, 0.3, 0.3]} position={[3, 0, 0]} />
        </MovingItem>
      ))}

</group><group position={[0, 0, -2]} ref={ref}>
      {/* Road blocks */}
      {[...Array(ROAD_BLOCKS_NUMBER)].map((_v, index) => (
        <MovingItem
          key={`road-${index}`}
          speed={treesSpeed}
          position={[OFFSET_X * 2 + (index * ROAD_BLOCK_WIDTH), 0, -1]}
        >
          <RoadBlock
            scale={[120, 3, 8]}
          />
        </MovingItem>
      ))}
      
      <MovingItem speed={vehicleSpeed}>
        <TruckFlat scale={[1.0, 1.0, 1.0]} position={[2, 0, 0]} rotation-y={MathUtils.degToRad(270)}/>
      </MovingItem>
      <MovingItem speed={vehicleSpeed}>
        <Taxi rotation-y={MathUtils.degToRad(270)} position={[-3, -0.02, 0]} scale={[0.8, 0.8, 0.8]}/>
      </MovingItem>
      
      <MovingItem speed={vehicleSpeed - 0.02}>
        <Bus rotation-y={MathUtils.degToRad(270)} position={[-8, 0, -2]} scale={[0.18, 0.18, 0.18]}/>
      </MovingItem>

      <MovingItem speed={vehicleSpeed - 0.02}>
        <Train rotation-y={MathUtils.degToRad(270)} position={[3, 0, -2]} scale={[0.05, 0.05, 0.05]}/>
      </MovingItem>
      
      {/* Stationary grass slice below the road */}
      <GrassSlice position={[0, -0.1, -1]} scale={[50, 1, 40]} />
    </group></>
  );
};

const LandingExperience = ({ isZooming, onAnimationComplete }: { isZooming: boolean; onAnimationComplete: () => void }) => {
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

export const Landing = () => {
  const [isZooming, setIsZooming] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.src = '/sounds/075176_duck-quack-40345.mp3';
    audio.preload = 'auto';
    
    // Add error handling
    audio.onerror = (e) => {
      console.error('Error loading audio:', e);
      console.error('Audio error details:', audio.error);
    };

    // Add load handling
    audio.oncanplaythrough = () => {
      console.log('Audio loaded successfully');
      audioRef.current = audio;
    };

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStartClick = () => {
    setIsZooming(true);
  };

  const handleAnimationComplete = () => {
    // Wait 1 second after animation completes before playing audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        console.error('Audio element not initialized');
      }
      // Wait another second before showing Experience
      setTimeout(() => {
        setShowExperience(true);
      }, 1000);
    }, 1000);
  };

  if (showExperience) {
    return <Experience />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        zIndex: 1000,
        fontSize: '64px',
        fontWeight: 'bold',
        fontFamily: '"Comic Sans MS", cursive',
        color: '#4CAF50',
        textAlign: 'center',
        textShadow: `
          2px 2px 0 #fff,
          -2px -2px 0 #fff,
          2px -2px 0 #fff,
          -2px 2px 0 #fff,
          4px 4px 0 rgba(0,0,0,0.1)
        `,
        letterSpacing: '1px',
        animation: 'bounce 2s infinite'
      }}>
        The Ugly Duckling
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-5px); }
          }
        `}
      </style>
      <Canvas style={{ background: "#87CEEB" }}>
        <LandingExperience isZooming={isZooming} onAnimationComplete={handleAnimationComplete} />
        <fog attach="fog" args={["#87CEEB", 12, 30]} />
      </Canvas>
      <button
        style={{
          position: 'absolute',
          bottom: '160px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '15px 40px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049';
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50';
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        }}
        onClick={handleStartClick}
      >
        Start
      </button>
    </div>
  );
};