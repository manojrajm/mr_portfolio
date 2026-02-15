import { Text, Image } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { portfolioData } from "../../utils/data";
import * as THREE from "three";
import { motion } from "framer-motion-3d";

const TiltCard = ({ project, index, ...props }) => {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        // Tilt Animation based on mouse position (when hovered) or just subtle float
        if (hovered && meshRef.current) {
            const mouseX = state.pointer.x * 0.5;
            const mouseY = state.pointer.y * 0.5;
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouseY, delta * 5);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, delta * 5);
            meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1), delta * 5);
        } else if (meshRef.current) {
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 2);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 2);
            meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5);
        }
    });

    return (
        <group {...props}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onClick={() => window.open(project.link || project.github, "_blank")}
            >
                <boxGeometry args={[2.5, 1.8, 0.1]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.2}
                    metalness={0.8}
                    emissive={hovered ? "#3333ff" : "#000"}
                    emissiveIntensity={hovered ? 0.2 : 0}
                />

                {/* Border Glow */}
                {hovered && (
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(2.5, 1.8, 0.1)]} />
                        <meshBasicMaterial color="#3333ff" />
                    </lineSegments>
                )}
            </mesh>

            <Text
                position={[0, -1.2, 0.1]}
                fontSize={0.15}
                color="white"
                anchorX="center"
            // font="./fonts/Inter-Bold.ttf" // Removed to use default
            >
                {project.title}
            </Text>
        </group>
    );
};

export const Gallery = (props) => {
    const { width } = useThree((state) => state.viewport);
    const isMobile = width < 5;

    return (
        <group {...props}>
            {portfolioData.projects.map((project, index) => {
                // Grid Layout Calculation
                const cols = isMobile ? 1 : 3;
                const x = (index % cols) * 3 - (cols === 3 ? 3 : 0);
                const y = -Math.floor(index / cols) * 2.5;

                return (
                    <TiltCard
                        key={index}
                        project={project}
                        index={index}
                        position={[x, y + 1.0, 0]}
                    />
                );
            })}
        </group>
    );
};
