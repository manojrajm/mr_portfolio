import { Stars, Sparkles, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Background = () => {
    const starsRef = useRef();

    useFrame((state, delta) => {
        if (starsRef.current) {
            starsRef.current.rotation.x -= delta * 0.005; // Even slower
            starsRef.current.rotation.y -= delta * 0.005;
        }
    });

    return (
        <>
            <color attach="background" args={["#020205"]} />

            <Stars
                ref={starsRef}
                radius={100}
                depth={50}
                count={7000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            <Sparkles
                count={200}
                scale={20}
                size={2}
                speed={0.4}
                color="#b084ff"
                opacity={0.2}
            />

            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#b084ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

            {/* Fog for depth */}
            <fog attach="fog" args={["#020205", 5, 25]} />
        </>
    );
};

