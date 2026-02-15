import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Overlay } from "./Overlay";
import { World } from "./World";
import { Background } from "./Background";
import { Suspense, useEffect } from "react";

const NavBridge = () => {
    const scroll = useScroll();

    useEffect(() => {
        window.scrollToSection = (sectionId) => {
            const isMobile = window.innerWidth < 768;
            const offsets = {
                'home': 0,
                'about': 0.12,
                'skills': 0.24,
                'projects': 0.38,
                'contact': isMobile ? 0.78 : 0.72
            };

            const target = offsets[sectionId];
            if (target !== undefined) {
                scroll.el.scrollTo({
                    top: target * (scroll.el.scrollHeight - scroll.el.clientHeight),
                    behavior: 'smooth'
                });
            }
        };
    }, [scroll]);

    return null;
};

export const Experience = () => {
    return (
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
            <color attach="background" args={["#111"]} />
            <Suspense fallback={null}>
                <ScrollControls pages={9} damping={0.1}>
                    <NavBridge />
                    <Background />
                    <Scroll>
                        <World />
                    </Scroll>
                    <Scroll html style={{ width: '100%' }}>
                        <Overlay />
                    </Scroll>
                </ScrollControls>
            </Suspense>
        </Canvas>
    );
};
