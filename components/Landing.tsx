"use client"
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
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

const Experience = () => {
  return (
    <>
      {/* <OrbitControls
        minAzimuthAngle={MathUtils.degToRad(-15)}
        maxAzimuthAngle={MathUtils.degToRad(15)}
        minPolarAngle={MathUtils.degToRad(45)}
        maxPolarAngle={MathUtils.degToRad(90)}
        minDistance={2}
        maxDistance={15}
      /> */}
      <OrbitControls />
      <ambientLight intensity={0.2} />
      <Environment preset="sunset" blur={0.8} />
      <group position={[0, -1, 0]}>
        <Background />
        <Duck
          rotation-y={MathUtils.degToRad(270)}
          position={[0.9, 0, -0.5]}
          scale={[0.5, 0.5, 0.5]}
        />
        
        <ContactShadows scale={[16, 16]} opacity={0.42} />
      </group>
    </>
  );
};

export const Landing = () => {
  return (
    <Canvas style={{ background: "#87CEEB" }}>
      <Experience />
      <fog attach="fog" args={["#87CEEB", 12, 30]} />
    </Canvas>
  );
};