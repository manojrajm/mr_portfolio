import { Scroll, ScrollControls, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Overlay } from "./Overlay";
import { Office } from "./sections/Office";
import { Gallery } from "./sections/Gallery";
import { Skills } from "./sections/Skills";
import { Avatar } from "./Avatar";
import { Physics } from "@react-three/rapier";

// ScrollManager removed as state is no longer needed.

const GlobalAvatar = () => {
    const scroll = useScroll();
    const group = useRef();
    const { width } = useThree((state) => state.viewport);
    const isMobile = width < 5;
    const [startTime] = useState(Date.now());

    useFrame((state) => {
        if (!group.current) return;

        // Intro Animation: 2 seconds of cinematic entrance
        const elapsed = (Date.now() - startTime) / 1000;
        const introFactor = Math.max(0, 1 - elapsed / 2); // Goes from 1 to 0 in 2s

        const scale = isMobile ? 0.8 : 1.0;
        const rightPos = isMobile ? 0.5 : 2.0;
        const leftPos = isMobile ? -0.5 : -2.1;

        // Explicit Time-Based Keyframes (Hold - Move - Hold)
        // t: Scroll Offset (0 to 1)
        // Explicit Time-Based Keyframes (Hold - Move - Hold)
        // t: Scroll Offset (0 to 1)
        const keyframes = [
            // HERO (Page 1) -> 0.0 to 0.16
            { t: 0.00, pos: [0, isMobile ? -0.85 : -1.6, 1.5], rot: [0, -0.4, 0], scale: scale },
            { t: 0.12, pos: [0, isMobile ? -0.85 : -1.6, 1.5], rot: [0, -0.4, 0], scale: scale },

            // ABOUT (Page 2) -> 0.16 to 0.33
            { t: 0.22, pos: [isMobile ? leftPos : -1.2, -1.1, 2.5], rot: [0, 0.5, 0], scale: scale * 1.1 },
            { t: 0.30, pos: [isMobile ? leftPos : -1.2, -1.1, 2.5], rot: [0, 0.5, 0], scale: scale * 1.1 },

            // SKILLS (Page 3) -> 0.33 to 0.50
            { t: 0.38, pos: [isMobile ? rightPos : 1.4, -1.5, 1.8], rot: [0, -0.5, 0], scale: scale },
            { t: 0.46, pos: [isMobile ? rightPos : 1.4, -1.5, 1.8], rot: [0, -0.5, 0], scale: scale },

            // PROJECTS (Page 4) -> 0.50 to 0.66
            { t: 0.56, pos: [isMobile ? 0 : 1.8, -1.2, -1], rot: [0, -0.8, 0], scale: scale * 0.9 },
            { t: 0.64, pos: [isMobile ? 0 : 1.8, -1.2, -1], rot: [0, -0.8, 0], scale: scale * 0.9 },

            // CONTACT (Page 5) -> 0.66 to 0.83
            { t: 0.72, pos: [isMobile ? 0 : -1.5, -1.4, 2], rot: [0, 0.4, 0], scale: scale * 1.1 },
            { t: 0.80, pos: [isMobile ? 0 : -1.5, -1.4, 2], rot: [0, 0.4, 0], scale: scale * 1.1 },

            // FOOTER (Page 6) -> 0.83 to 1.00
            { t: 0.90, pos: [0, -1.8, 2], rot: [0, 0, 0], scale: scale },
            { t: 0.98, pos: [0, -1.8, 2], rot: [0, 0, 0], scale: scale }
        ];


        const scrollOffset = scroll.offset;
        let startFrame = keyframes[0];
        let endFrame = keyframes[keyframes.length - 1];

        for (let i = 0; i < keyframes.length - 1; i++) {
            if (scrollOffset >= keyframes[i].t && scrollOffset < keyframes[i + 1].t) {
                startFrame = keyframes[i];
                endFrame = keyframes[i + 1];
                break;
            }
        }

        // Calculate local progress (0 to 1) between these two frames
        const segmentDuration = endFrame.t - startFrame.t;
        const segmentProgress = (scrollOffset - startFrame.t) / segmentDuration;
        const clampedProgress = Math.max(0, Math.min(1, segmentProgress));

        // Easing function for smoother transitions (CubicInOut)
        const easeProgress = clampedProgress < 0.5
            ? 4 * clampedProgress * clampedProgress * clampedProgress
            : 1 - Math.pow(-2 * clampedProgress + 2, 3) / 2;

        // Interpolate with eased progress
        const targetPos = new THREE.Vector3(...startFrame.pos);
        const endPos = new THREE.Vector3(...endFrame.pos);
        group.current.position.lerpVectors(targetPos, endPos, easeProgress);

        // Intro Override: Drop the avatar from above
        if (elapsed < 2) {
            group.current.position.y += Math.pow(introFactor, 2) * 10;
        }

        // Rotation Interpolation
        group.current.rotation.x = THREE.MathUtils.lerp(startFrame.rot[0], endFrame.rot[0], easeProgress);
        group.current.rotation.y = THREE.MathUtils.lerp(startFrame.rot[1], endFrame.rot[1], easeProgress);
        group.current.rotation.z = THREE.MathUtils.lerp(startFrame.rot[2], endFrame.rot[2], easeProgress);

        const currentScale = THREE.MathUtils.lerp(startFrame.scale, endFrame.scale, easeProgress);
        group.current.scale.set(currentScale, currentScale, currentScale);

        // Intro Camera Effect
        if (elapsed < 3) {
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5 + introFactor * 10, 0.1);
            state.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    });



    return (
        <group ref={group}>
            <Avatar />
        </group>
    );
};

export const World = () => {
    const { height } = useThree((state) => state.viewport);

    return (
        <>
            <Physics gravity={[0, -9.81, 0]}>
                {/* Section 1: Hero - Page 1 */}
                <group position={[0, -height * 0.05, 0]}>
                    <Office scale={0.8} />
                </group>

                {/* Sections positioned relative to scroll pages for context, 
                    but Avatar moves independently */}

                {/* Section 3: Skills - Page 3 */}
                <group position={[0, -height * 2, 0]}>
                    <Skills />
                </group>

                {/* Section 4: Projects - Page 4 */}
                <group position={[0, -height * 3, 0]}>
                    <Gallery />
                </group>

                {/* Global Moving Character */}
                <GlobalAvatar />
            </Physics>
        </>
    );
};
