import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Avatar } from "../Avatar";

export const Office = (props) => {
    const { width } = useThree((state) => state.viewport);
    const isMobile = width < 5;

    return (
        <group {...props}>
            {/* Cinematic Lighting */}
            <spotLight
                position={[5, 10, 5]}
                angle={0.15}
                penumbra={1}
                intensity={2}
                castShadow
            />
            <pointLight position={[-3, 2, -3]} intensity={1} color="#3333ff" />
            <pointLight position={[3, 2, 3]} intensity={1} color="#ff00cc" />

            {/* The Character has been moved to World.jsx for scroll animation */}
            {/* <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <Avatar position={[0.5, -1.2, 0]} scale={isMobile ? 1.3 : 1.8} rotation-y={-0.2} /> 
            </Float> */}

            {/* Ground Reflections */}
            <ContactShadows
                opacity={0.5}
                scale={10}
                blur={2}
                far={4}
                resolution={256}
                color="#000000"
            />

        </group>
    );
};
