"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import * as THREE from "three";
import { randFloatSpread } from "three/src/math/MathUtils.js";

import { Experience } from "./Experience";
import Duck from "./graphs/Duck";
import Taxi from "./graphs/Taxi";
import TreeBeech from "./graphs/TreeBeech";
import TreeLime from "./graphs/TreeLime";
import TruckFlat from "./graphs/TruckFlat";
import styles from "./landing/Landing.module.css";

const OFFSET_X = 35;
const ROAD_BLOCK_WIDTH = 2; // Approximate width of each road block
const ROAD_BLOCKS_NUMBER = Math.ceil((OFFSET_X * 2) / ROAD_BLOCK_WIDTH) + 2; // Number of blocks needed to cover the view
const TREES_NUMBER = 10;
const TREES_SPEED = 0.03;
const RANDOMIZER_STRENGTH_POSITION = 0.42;
const RANDOMIZER_STRENGTH_SCALE = 1;

// Navigation options
const NAV_OPTIONS = {
  main: [
    { name: "UI Mode", path: "/ui", description: "Explore our user interface" },
    {
      name: "Interactive Mode",
      path: "/interactive",
      description: "Jump into interactive learning",
    },
  ],
  avatars: [
    {
      name: "Leo",
      path: "/interactive/avatar/leo",
      description: "Friendly and curious",
    },
    {
      name: "Rex",
      path: "/interactive/avatar/rex",
      description: "Bold and adventurous",
    },
    {
      name: "Aria",
      path: "/interactive/avatar/aria",
      description: "Creative and thoughtful",
    },
    {
      name: "Teacher",
      path: "/interactive/avatar/teacher",
      description: "Wise and helpful",
    },
  ],
};

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
  }, [props.randomizePosition, props.randomizeScale]);

  return (
    <group
      ref={ref}
      position={[initialX, props.position?.[1] ?? 0, props.position?.[2] ?? 0]}
    >
      {props.children}
    </group>
  );
};

function RoadBlock(props: {
  position?: [number, number, number];
  scale?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/road_block.glb");
  return (
    <primitive
      object={scene}
      scale={props.scale ?? [0.5, 0.5, 0.5]}
      position={props.position}
    />
  );
}

function GrassSlice(props: {
  position?: [number, number, number];
  scale?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/grass_slice.glb");
  return (
    <primitive
      object={scene}
      scale={props.scale ?? [1, 1, 1]}
      position={props.position}
    />
  );
}

function Bus(props: {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  "rotation-y"?: number;
}) {
  const { scene } = useGLTF("/models/bus.glb");
  return (
    <primitive
      object={scene}
      scale={props.scale ?? [1, 1, 1]}
      position={props.position}
      rotation={props.rotation}
      rotation-y={props["rotation-y"]}
    />
  );
}

function Train(props: {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  "rotation-y"?: number;
}) {
  const { scene } = useGLTF("/models/train.glb");
  return (
    <primitive
      object={scene}
      scale={props.scale ?? [1, 1, 1]}
      position={props.position}
      rotation={props.rotation}
      rotation-y={props["rotation-y"]}
    />
  );
}

const Background = () => {
  const ref = useRef<THREE.Group>(null);

  const { treesNumber, treesSpeed } = {
    treesNumber: TREES_NUMBER,
    treesSpeed: TREES_SPEED,
  };
  const vehicleSpeed = -0.05; // Negative speed to move left

  return (
    <>
      <group position={[0, 0, -5]} ref={ref}>
        {[...Array(treesNumber)].map((_v, index) => (
          <MovingItem
            key={index}
            speed={treesSpeed}
            position={[
              -OFFSET_X + (index / treesNumber) * OFFSET_X * 2,
              0,
              -1.5,
            ]}
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
            position={[
              -OFFSET_X + (index / treesNumber) * OFFSET_X * 2,
              0,
              -2.5,
            ]}
            randomizePosition={true}
            randomizeScale={true}
          >
            <TreeLime scale={[0.3, 0.3, 0.3]} position={[3, 0, 0]} />
          </MovingItem>
        ))}
      </group>
      <group position={[0, 0, -2]} ref={ref}>
        {/* Road blocks */}
        {[...Array(ROAD_BLOCKS_NUMBER)].map((_v, index) => (
          <MovingItem
            key={`road-${index}`}
            speed={treesSpeed}
            position={[OFFSET_X * 2 + index * ROAD_BLOCK_WIDTH, 0, -1]}
          >
            <RoadBlock scale={[120, 3, 8]} />
          </MovingItem>
        ))}

        <MovingItem speed={vehicleSpeed}>
          <TruckFlat
            scale={[1.0, 1.0, 1.0]}
            position={[2, 0, 0]}
            rotation-y={MathUtils.degToRad(270)}
          />
        </MovingItem>
        <MovingItem speed={vehicleSpeed}>
          <Taxi
            rotation-y={MathUtils.degToRad(270)}
            position={[-3, -0.02, 0]}
            scale={[0.8, 0.8, 0.8]}
          />
        </MovingItem>

        <MovingItem speed={vehicleSpeed - 0.02}>
          <Bus
            rotation-y={MathUtils.degToRad(270)}
            position={[-8, 0, -2]}
            scale={[0.18, 0.18, 0.18]}
          />
        </MovingItem>

        <MovingItem speed={vehicleSpeed - 0.02}>
          <Train
            rotation-y={MathUtils.degToRad(270)}
            position={[3, 0, -2]}
            scale={[0.05, 0.05, 0.05]}
          />
        </MovingItem>

        {/* Stationary grass slice below the road */}
        <GrassSlice position={[0, -0.1, -1]} scale={[50, 1, 40]} />
      </group>
    </>
  );
};

const LandingExperience = ({
  isZooming,
  onAnimationComplete,
}: {
  isZooming: boolean;
  onAnimationComplete: () => void;
}) => {
  const { camera } = useThree();
  type OrbitControlsRef = {
    enabled: boolean;
    target: THREE.Vector3;
    update: () => void;
  };
  const [isControlsEnabled, setIsControlsEnabled] = useState(true);

  useEffect(() => {
    if (!isZooming || !camera) return;

    setIsControlsEnabled(false);

    // Store initial camera position
    const startPosition = camera.position.clone();
    const startTarget = new THREE.Vector3(0, 0, 0);

    // Adjust these values to get a better view of the duck's face
    const endPosition = new THREE.Vector3(0.4, 0.1, 0.6);
    const endTarget = new THREE.Vector3(0.9, 0.1, -0.5);

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      camera.position.lerpVectors(startPosition, endPosition, easeProgress);
      camera.lookAt(
        new THREE.Vector3().lerpVectors(startTarget, endTarget, easeProgress),
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Re-enable controls and notify parent
        setIsControlsEnabled(true);
        setTimeout(onAnimationComplete, 2000); // Wait 2 seconds before calling onAnimationComplete
      }
    };

    animate();
  }, [isZooming, camera, onAnimationComplete, setIsControlsEnabled]);

  return (
    <>
      {isControlsEnabled && (
        <OrbitControls
          minAzimuthAngle={MathUtils.degToRad(-45)}
          maxAzimuthAngle={MathUtils.degToRad(45)}
          minPolarAngle={MathUtils.degToRad(45)}
          maxPolarAngle={MathUtils.degToRad(90)}
          minDistance={1}
          maxDistance={8}
        />
      )}
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
  const [showExperience] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.src = "/sounds/075176_duck-quack-40345.mp3";
    audio.preload = "auto";

    // Add error handling
    audio.onerror = (e) => {
      console.error("Error loading audio:", e);
      console.error("Audio error details:", audio.error);
    };

    // Add load handling
    audio.oncanplaythrough = () => {
      console.log("Audio loaded successfully");
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
    // Show menu immediately after animation completes
    setShowMenu(true);

    // Wait 1 second before playing the quack sound
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        console.error("Audio element not initialized");
      }
    }, 1000);
  };

  if (showExperience) {
    return <Experience />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>The Ugly Duckling</div>
      <Canvas style={{ background: "#87CEEB" }}>
        <LandingExperience
          isZooming={isZooming}
          onAnimationComplete={handleAnimationComplete}
        />
        <fog attach="fog" args={["#87CEEB", 12, 30]} />
      </Canvas>

      {!isZooming && (
        <button className={styles.startButton} onClick={handleStartClick}>
          Start Adventure
        </button>
      )}

      {showMenu && (
        <div
          className={`${styles.menuContainer} ${showMenu ? styles.visible : ""}`}
        >
          <div className={styles.menuCard}>
            <h1 className={styles.menuTitle}>Choose Your Experience</h1>

            <div className={styles.menuSection}>
              <h2 className={styles.sectionTitle}>Main Options</h2>
              <div className={styles.optionsGrid}>
                {NAV_OPTIONS.main.map((option, index) => (
                  <Link
                    href={option.path}
                    key={`main-${index}`}
                    className={styles.navLink}
                  >
                    <div className={styles.optionCard}>
                      <h3 className={styles.optionTitle}>{option.name}</h3>
                      <p className={styles.optionDescription}>
                        {option.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.menuSection}>
              <h2 className={styles.sectionTitle}>Quick Avatar Access</h2>
              <div className={styles.avatarsGrid}>
                {NAV_OPTIONS.avatars.map((avatar, index) => (
                  <Link
                    href={avatar.path}
                    key={`avatar-${index}`}
                    className={styles.navLink}
                  >
                    <div className={styles.avatarCard}>
                      <h3 className={styles.avatarName}>{avatar.name}</h3>
                      <p className={styles.avatarDescription}>
                        {avatar.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.aboutLinkContainer}>
              <Link href="/ui/about" className={styles.aboutLink}>
                Learn more about our app
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
