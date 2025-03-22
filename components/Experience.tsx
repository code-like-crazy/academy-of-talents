"use client"
import { Box,Environment,Gltf,OrbitControls,CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Teacher } from "./Teacher";
import { MathUtils } from "three";

export const Experience = () => {
    return (
        <Canvas camera={{
            position: [0, 0, 0.00001],
            fov: 75
        }}>
            <CameraManager />
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} color="white" />
            <Teacher teacher="krins" position={[-12.3, -12.0, -25.0]} scale={7.0} rotation-y={MathUtils.degToRad(30)}/>
            {/* <Gltf src="/models/anime_class_room.glb" position={[2.5, -2.8, 10.0]} rotation={[0, Math.PI, 0]} /> */}
            <Gltf src="/models/anime_classroom.glb" position={[-12.3, -20.0, 59.0]} rotation={[0, MathUtils.degToRad(270), 0]} />
        </Canvas>
    )
}

const CameraManager = () => {
    return <CameraControls 
        minZoom={1}
        maxZoom={3}
        polarRotateSpeed={-0.3}
        azimuthRotateSpeed={-0.3}
        mouseButtons={{
            left: 1, // rotate
            middle: 4, // pan
            right: 2, // pan
            wheel: 16, // zoom
        }}
        touches={{
            one: 32, // rotate
            two: 512, // zoom
            three: 1024 // pan
        }}
    />
}

