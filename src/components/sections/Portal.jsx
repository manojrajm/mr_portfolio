import { Torus, Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { portfolioData } from "../../utils/data";

export const Portal = (props) => {
    const torusRef = useRef();

    useFrame((state) => {
        torusRef.current.rotation.z -= 0.02;
    });

    return (
        <group {...props}>
            <Torus ref={torusRef} args={[2, 0.2, 16, 100]}>
                <meshStandardMaterial
                    color="#ff0000"
                    emissive="#ff0000"
                    emissiveIntensity={2}
                />
            </Torus>

            <Sparkles count={200} scale={6} size={4} speed={0.4} opacity={0.5} color="#ff00cc" />

            <mesh position={[0, 0, -0.1]}>
                <circleGeometry args={[1.8, 32]} />
                <meshBasicMaterial color="black" />
            </mesh>

            <Text
                position={[0, 0.5, 0]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                Get In Touch
            </Text>
            <Text
                position={[0, -0.5, 0]}
                fontSize={0.2}
                color="#ccc"
                anchorX="center"
                anchorY="middle"
                onClick={() => window.open(`mailto:${portfolioData.personal.email}`)}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                {portfolioData.personal.email}
            </Text>
        </group>
    );
};
