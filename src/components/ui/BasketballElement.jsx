import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import basketballImg from "../assets/BB.png";

export const BasketballElement = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [target, setTarget] = useState({ x: 50, y: 50, rotate: 0 });
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Update target every 6-10 seconds
        const updateTarget = () => {
            if (!isMounted.current || window.innerWidth < 768) return;
            setTarget({
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
                rotate: Math.random() * 720 - 360
            });
        };

        const interval = setInterval(updateTarget, 7000);
        updateTarget();

        return () => {
            isMounted.current = false;
            window.removeEventListener('resize', checkMobile);
            clearInterval(interval);
        };
    }, []);

    if (isMobile) return null;

    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotate,
                scale: [1, 1.1, 0.9, 1],
            }}
            initial={{ x: -100, y: -100, scale: 0 }}
            transition={{
                x: { duration: 6, ease: "linear" },
                y: { duration: 6, ease: "linear" },
                rotate: { duration: 6, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, repeatDelay: 5 }
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 5,
                pointerEvents: 'none',
                width: '60px',
                height: '60px',
            }}
        >
            <img
                src={basketballImg}
                alt="Basketball"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))'
                }}
            />
        </motion.div>
    );
};
