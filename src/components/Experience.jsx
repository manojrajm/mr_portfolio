import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Overlay } from "./Overlay";
import { World } from "./World";
import { Background } from "./Background";
import { Suspense, useEffect, Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("3D Scene Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) return this.props.fallback || null;
        return this.props.children;
    }
}

const NavBridge = () => {
    const scroll = useScroll();

    useEffect(() => {
        const handler = (sectionId) => {
            const isMobile = window.innerWidth < 768;
            const offsets = {
                'home': 0,
                'about': 0.12,
                'skills': 0.24,
                'projects': 0.38,
                'contact': isMobile ? 0.78 : 0.72
            };

            const target = offsets[sectionId];
            if (target !== undefined && scroll.el) {
                scroll.el.scrollTo({
                    top: target * (scroll.el.scrollHeight - scroll.el.clientHeight),
                    behavior: 'smooth'
                });
            }
        };

        window.scrollToSection = handler;
        return () => { delete window.scrollToSection; };
    }, [scroll]);

    return null;
};

export const Experience = () => {
    return (
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
            <ScrollControls pages={9} damping={0.1}>
                <NavBridge />
                <Background />
                <Scroll>
                    <Suspense fallback={null}>
                        <ErrorBoundary fallback={null}>
                            <World />
                        </ErrorBoundary>
                    </Suspense>
                </Scroll>
                <Scroll html style={{ width: '100%' }}>
                    <Overlay />
                </Scroll>
            </ScrollControls>
        </Canvas>
    );
};
