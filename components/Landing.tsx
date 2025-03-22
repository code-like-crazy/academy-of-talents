"use client"
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";
import * as THREE from "three";
import Taxi from "./graphs/Taxi";
import TreeLime from "./graphs/TreeLime";
import Duck from "./graphs/Duck";
import TreeBeech from "./graphs/TreeBeech";
import TruckFlat from "./graphs/TruckFlat";
import Tree from "./graphs/Tree";

const MovingItem = (props: { children: React.ReactNode }) => {
    const ref = useRef<THREE.Group>(null);
    const delta = 0.01; // Speed of movement

    useFrame(() => {
        if (ref.current) {
            ref.current.position.x += delta;
        }
    });

    return <group ref={ref}>{props.children}</group>
};

const Background = () => {
  const ref = useRef<THREE.Group>(null);

  return (
    <><group position={[0, 0, -5]} ref={ref}>
            <MovingItem>
                <TreeLime scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
            </MovingItem>

            <MovingItem>
                <TreeBeech scale={[0.3, 0.3, 0.3]} position={[4, 0, 0]} />
            </MovingItem>
            {/* <Tree scale={[3, 3, 3]} position={[0, 0, -6]} /> */}


      </group><group position={[0, 0, -2]} ref={ref}>
            <TruckFlat scale={[1.0, 1.0, 1.0]} position={[2, 0, 0]} rotation-y={MathUtils.degToRad(270)}/>
            <Taxi rotation-y={MathUtils.degToRad(270)} position={[-3, -0.02, 0]} scale={[0.8, 0.8, 0.8]}/>
    </group></>
  );
};

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.2} />
      <Environment preset="sunset" blur={0.8} />
      <group position={[0, -1, 0]}>
        <Background />
        <Duck
          rotation-y={MathUtils.degToRad(270)}
          position={[0.9, 0, 0]}
          scale={[0.5, 0.5, 0.5]}
        />
        
        <ContactShadows scale={[16, 16]} opacity={0.42} />
      </group>
    </>
  );
};

export const Landing = () => {
  return (
    <Canvas>
      <Experience />
    </Canvas>
  );
};