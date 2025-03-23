import { useRef } from "react";
import * as THREE from "three";
import { MathUtils } from "three";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import { useGLTF } from "@react-three/drei";
import Taxi from "../graphs/Taxi";
import TreeLime from "../graphs/TreeLime";
import TreeBeech from "../graphs/TreeBeech";
import TruckFlat from "../graphs/TruckFlat";
import Bus from "./models/Bus";
import Train from "./models/Train";
import RoadBlock from "./models/RoadBlock";
import GrassSlice from "./models/GrassSlice";
import { MovingItem } from "./MovingItem";

const OFFSET_X = 35;
const ROAD_BLOCK_WIDTH = 2; // Approximate width of each road block
const ROAD_BLOCKS_NUMBER = Math.ceil(OFFSET_X * 2 / ROAD_BLOCK_WIDTH) + 2; // Number of blocks needed to cover the view
const TREES_NUMBER = 10;
const TREES_SPEED = 0.03;
const RANDOMIZER_STRENGTH_POSITION = 0.42;
const RANDOMIZER_STRENGTH_SCALE = 1;

export const Background = () => {
  const ref = useRef<THREE.Group>(null);
  const {treesNumber, treesSpeed} = {treesNumber: TREES_NUMBER, treesSpeed: TREES_SPEED}
  const vehicleSpeed = -0.05; // Negative speed to move left

  return (
    <>
      <group position={[0, 0, -5]} ref={ref}>
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
      </group>
      <group position={[0, 0, -2]} ref={ref}>
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
      </group>
    </>
  );
}; 