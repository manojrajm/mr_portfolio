import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Cursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });

            // Check if hovering over clickable elements
            const target = e.target;
            setIsHovering(
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.style.cursor === 'pointer'
            );
        };

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            height: 32,
            width: 32,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
        },
        hover: {
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            height: 64,
            width: 64,
            backgroundColor: "rgba(255, 0, 204, 0.1)",
            border: "1px solid rgba(255, 0, 204, 0.8)",
            mixBlendMode: "difference",
        },
    };

    return (
        <>
            <motion.div
                className="cursor"
                variants={variants}
                animate={isHovering ? "hover" : "default"}
                transition={{
                    default: { type: "spring", stiffness: 500, damping: 28 }
                }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    backdropFilter: "blur(2px)",
                }}
            />
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "8px",
                    height: "8px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
                    pointerEvents: "none",
                    zIndex: 10000,
                    transition: "transform 0.1s ease-out"
                }}
            />
        </>
    );
};
