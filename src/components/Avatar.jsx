import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";

export const Avatar = (props) => {
    const headRef = useRef();
    const groupRef = useRef();
    const bodyRef = useRef();

    useFrame((state) => {
        if (!headRef.current) return;

        // Mouse Tracking (Head)
        const targetX = state.pointer.x * 0.4;
        const targetY = state.pointer.y * 0.4;

        // Smooth LookAt
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.05);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetY, 0.05);

        // Subtle body sway
        if (bodyRef.current) {
            bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, targetX * 0.2, 0.05);
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Head Group */}
                <group ref={headRef} position={[0, 1.6, 0]}>
                    <mesh castShadow>
                        <boxGeometry args={[0.7, 0.6, 0.5]} />
                        <meshStandardMaterial
                            color="#fff"
                            roughness={0.1}
                            metalness={0.8}
                            envMapIntensity={2}
                        />
                    </mesh>

                    {/* Face Screen */}
                    <mesh position={[0, -0.05, 0.26]}>
                        <planeGeometry args={[0.55, 0.4]} />
                        <meshStandardMaterial color="#050510" roughness={0} metalness={1} />
                    </mesh>

                    {/* Eyes - Pulse */}
                    <group position={[0, 0, 0.27]}>
                        <mesh position={[-0.18, 0.05, 0]}>
                            <circleGeometry args={[0.07, 32]} />
                            <meshBasicMaterial color="#00ffff" />
                        </mesh>
                        <mesh position={[0.18, 0.05, 0]}>
                            <circleGeometry args={[0.07, 32]} />
                            <meshBasicMaterial color="#00ffff" />
                        </mesh>
                    </group>

                    {/* Antenna */}
                    <mesh position={[0, 0.35, 0]}>
                        <cylinderGeometry args={[0.01, 0.01, 0.2]} />
                        <meshStandardMaterial color="#888" />
                    </mesh>
                    <mesh position={[0, 0.45, 0]}>
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshStandardMaterial color="#ff0088" emissive="#ff0088" emissiveIntensity={4} />
                    </mesh>
                </group>

                {/* Body */}
                <group ref={bodyRef} position={[0, 0.8, 0]}>
                    <mesh castShadow>
                        <capsuleGeometry args={[0.35, 0.8, 4, 16]} />
                        <meshStandardMaterial
                            color="#f0f0f0"
                            roughness={0.2}
                            metalness={0.9}
                        />
                    </mesh>

                    {/* Core */}
                    <mesh position={[0, 0.2, 0.25]}>
                        <boxGeometry args={[0.2, 0.2, 0.1]} />
                        <MeshWobbleMaterial
                            color="#b084ff"
                            emissive="#b084ff"
                            emissiveIntensity={2}
                            factor={0.4}
                            speed={2}
                        />
                    </mesh>
                </group>

                {/* Arms (Floating) */}
                <group position={[-0.6, 0.9, 0]}>
                    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                        <mesh castShadow>
                            <sphereGeometry args={[0.12, 16, 16]} />
                            <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
                        </mesh>
                    </Float>
                </group>
                <group position={[0.6, 0.9, 0]}>
                    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                        <mesh castShadow>
                            <sphereGeometry args={[0.12, 16, 16]} />
                            <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
                        </mesh>
                    </Float>
                </group>
            </Float>
        </group>
    );
};

