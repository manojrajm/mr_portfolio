import { Text, Float, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { portfolioData } from "../../utils/data";
import * as THREE from "three";

const Word = ({ children, ...props }) => {
    const color = new THREE.Color();
    const fontProps = { fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, "material-toneMapped": false };
    const ref = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame(({ camera }) => {
        // Make text face camera always
        ref.current.quaternion.copy(camera.quaternion);
        ref.current.material.color.lerp(color.set(hovered ? "#ff00cc" : "#f0f0f0"), 0.1);
    });

    return (
        <Text ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} {...props} {...fontProps}>
            {children}
        </Text>
    );
}

export const Skills = (props) => {
    // Generate spherical coordinates for skills
    const skills = useMemo(() => {
        const temp = [];
        const phiSpan = Math.PI * 2;
        const thetaSpan = Math.PI; // Full sphere

        const count = portfolioData.skills.length;

        for (let i = 0; i < count; i++) {
            // Simple spherical distribution
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            temp.push({
                pos: new THREE.Vector3().setFromSphericalCoords(3, phi, theta),
                word: portfolioData.skills[i].name
            });
        }
        return temp;
    }, []);

    const groupRef = useRef();

    useFrame((state, delta) => {
        groupRef.current.rotation.y += delta * 0.1;
        groupRef.current.rotation.x += delta * 0.05;
    });

    return (
        <group {...props} ref={groupRef}>
            {/* 3D Skills Removed per user request */}
            <group />
        </group>
    )
}
