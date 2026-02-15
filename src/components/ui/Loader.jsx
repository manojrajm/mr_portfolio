import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const CustomLoader = () => {
    const { progress, active, total } = useProgress();
    const [isFinished, setIsFinished] = useState(false);
    const [bootText, setBootText] = useState("INITIALIZING_CORE...");

    const bootSequences = [
        "BOOT_SECTOR_LOADED...",
        "CONNECTING_NEURAL_LINKS...",
        "MAPPING_3D_ENVIRONMENT...",
        "RENDERING_AVATAR_MESH...",
        "STABILIZING_FLUID_DYNAMICS...",
        "SYSTEM_READY."
    ];

    useEffect(() => {
        // Dynamic boot text tied to progress
        const currentPhase = Math.floor((progress / 100) * (bootSequences.length - 1));
        setBootText(bootSequences[currentPhase]);

        // Finish if 100% or if nothing to load
        if (progress === 100 || (total === 0 && !active)) {
            const timer = setTimeout(() => setIsFinished(true), 1200);
            return () => clearTimeout(timer);
        }

        // Emergency Fail-safe: Force finish after 5 seconds
        const failSafe = setTimeout(() => {
            if (!isFinished) setIsFinished(true);
        }, 5000);

        return () => clearTimeout(failSafe);
    }, [progress, total, active]);


    return (
        <AnimatePresence>
            {!isFinished && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1, ease: "easeInOut" }
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: '#020205',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        color: 'var(--primary)',
                        fontFamily: "'Courier New', Courier, monospace",
                        letterSpacing: '2px'
                    }}
                >
                    <div style={{ width: '300px', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>
                            {bootText}
                        </div>

                        {/* Progress Bar Container */}
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                style={{
                                    height: '100%',
                                    background: 'var(--primary)',
                                    boxShadow: '0 0 15px var(--primary)'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem' }}>CORE_V4.0</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* HUD Decorations */}
                    <motion.div
                        animate={{
                            rotate: 360,
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 2, repeat: Infinity }
                        }}
                        style={{
                            position: 'absolute',
                            width: '400px',
                            height: '400px',
                            border: '1px dashed rgba(176, 132, 255, 0.2)',
                            borderRadius: '50%',
                            pointerEvents: 'none'
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
