import { Scroll } from "@react-three/drei";
import { useEffect, useState, useRef, useMemo } from "react";
import { portfolioData } from "../utils/data";
import { Section } from "./Section";
import { MagneticButton } from "./ui/MagneticButton";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const StaggeredText = ({ text, className, style, delay = 0 }) => {
    const letters = Array.from(text);
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * i },
        }),
    };
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.div
            style={{ display: "flex", overflow: "hidden", ...style }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

const SkillBadge = ({ skill, icon }) => (
    <div className="glass" style={{
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        border: '1px solid rgba(176, 132, 255, 0.1)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
            e.currentTarget.style.borderColor = 'rgba(176, 132, 255, 0.4)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(176, 132, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = 'rgba(176, 132, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        }}
    >
        <span style={{ fontSize: '1.2rem' }}>{icon || '💻'}</span>
        <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem', letterSpacing: '0.5px' }}>{skill}</span>
    </div>
);

const getBrandIconClass = (name) => {
    const map = {
        'JavaScript': 'devicon-javascript-plain colored',
        'ReactJs': 'devicon-react-original colored',
        'Python': 'devicon-python-plain colored',
        'NodeJS': 'devicon-nodejs-plain colored',
        'TypeScript': 'devicon-typescript-plain colored',
        'FireBase': 'devicon-firebase-plain colored',
        'Java': 'devicon-java-plain colored',
        'Bootstrap': 'devicon-bootstrap-plain colored',
        'MySql': 'devicon-mysql-plain colored',
        'PostgreSQL': 'devicon-postgresql-plain colored',
        'MongoDB': 'devicon-mongodb-plain colored',
        'ReactNative': 'devicon-react-original colored',
        'HTML5': 'devicon-html5-plain colored',
        'CSS3': 'devicon-css3-plain colored',
        'Sass': 'devicon-sass-original colored',
        'Tailwind': 'devicon-tailwindcss-plain colored',
        'Git': 'devicon-git-plain colored',
        'PHP': 'devicon-php-plain colored',
        'Bash': 'devicon-bash-plain colored',
        'Figma': 'devicon-figma-plain colored',
        'Photoshop': 'devicon-photoshop-plain colored',
        'Blender': 'devicon-blender-original colored',
    };
    return map[name] || 'devicon-javascript-plain';
};


const NebulaSkill = ({ skill, mouseX, mouseY, pos }) => {
    const ref = useRef(null);
    const center = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updateCenter = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                center.current = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            }
        };
        // Small delay to ensure layout has settled
        const timeoutId = setTimeout(updateCenter, 100);
        window.addEventListener('resize', updateCenter);
        return () => {
            window.removeEventListener('resize', updateCenter);
            clearTimeout(timeoutId);
        };
    }, [pos]);

    // Proximity calculation using container-relative coordinates
    const scale = useTransform([mouseX, mouseY], ([mX, mY]) => {
        const dx = (mX || 0) - (pos.x * 0.01 * (window.innerWidth * 0.9)); // Approximate center
        const dy = (mY || 0) - (pos.y * 0.01 * (window.innerHeight * 0.8));
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 250;
        if (dist > radius || dist === 0) return 1;
        return 1 + (1 - dist / radius) * 0.5;
    });

    const springScale = useSpring(scale, { stiffness: 200, damping: 25 });
    const opacity = useTransform(springScale, [1, 1.5], [0.1, 0.6]); // Reduced opacity
    const zIndex = useTransform(springScale, [1, 1.5], [10, 100]);

    return (
        <motion.div
            ref={ref}
            className="nebula-skill-wrapper"
            style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                scale: springScale,
                opacity,
                zIndex
            }}
        >
            <div className="nebula-skill-tag">
                <i className={`${getBrandIconClass(skill)} nebula-icon-brand`} />
                <span className="nebula-name">{skill}</span>
            </div>
        </motion.div>
    );
};

const SkillNebula = ({ isMobile }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const containerRef = useRef(null);

    // Smooth lens position
    const lensX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const lensY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    const skillPositions = useMemo(() => {
        const skillsCount = portfolioData.skills.length;
        const columns = isMobile ? 3 : 5;
        const rows = Math.ceil(skillsCount / columns);
        const padding = isMobile ? 8 : 15; // Tighter padding on mobile

        return portfolioData.skills.map((_, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);

            // Refined hexagonal offset
            const offset = (row % 2) * (40 / columns);

            const x = padding + (col * (100 - 2 * padding) / (columns - 1)) + offset;
            const y = padding + (row * (100 - 2 * padding) / (rows - 1));

            return {
                x: Math.min(x, 100 - padding),
                y: Math.min(y, 100 - padding)
            };
        });
    }, [isMobile]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0 && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(e.touches[0].clientX - rect.left);
            mouseY.set(e.touches[0].clientY - rect.top);
        }
    };

    return (
        <div
            ref={containerRef}
            className="nebula-field"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchMove}
        >
            <motion.div
                className="nebula-lens"
                style={{
                    left: lensX,
                    top: lensY,
                    x: "-50%",
                    y: "-50%",
                    display: isMobile ? 'none' : 'block' // Hide lens glow on touch as it can be distracting
                }}
            />

            <div className="nebula-background-text">
                EXPERTISE
            </div>

            {portfolioData.skills.map((skill, index) => (
                <NebulaSkill
                    key={index}
                    skill={skill.name}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    pos={skillPositions[index]}
                />
            ))}
        </div>
    );
};

const SocialCard = ({ icon, label, value, link, delay = 0 }) => (
    <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.8 }}
        className="glass"
        style={{
            padding: '1.2rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            textDecoration: 'none',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            width: '100%',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(176, 132, 255, 0.1)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'scale(1.02) translateX(10px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(176, 132, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--glass)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'scale(1) translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            color: '#000',
            boxShadow: '0 5px 15px rgba(176, 132, 255, 0.3)'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {label}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#fff' }}>
                {value}
            </div>
        </div>
    </motion.a>
);


// Gaming Style Project Card
const ProjectCard = ({ project, index }) => (
    <div className="glass project-card" style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '380px',
        background: 'rgba(10, 10, 20, 0.4)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.05)'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(176, 132, 255, 0.2)';
            e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
        }}
    >
        {project.image && (
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(2,2,5,0.8))' }} />
            </div>
        )}
        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.8rem 0', color: '#fff', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.5px' }}>{project.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>{project.description}</p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: 'auto' }}>
                {project.link && (
                    <a href={project.link} target="_blank" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>Open Project →</a>
                )}
                {project.github && (
                    <a href={project.github} target="_blank" style={{ color: '#fff', fontSize: '0.9rem', opacity: 0.6, textDecoration: 'none', textTransform: 'uppercase' }}>Source</a>
                )}
            </div>
        </div>
    </div>
);

// GitHub SVG Icon Component
const GitHubIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const AboutImage = ({ isMobile }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{
                y: [0, -20, 0],
            }}
            transition={{
                duration: 1,
                y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                flex: '0 0 auto',
                cursor: 'pointer'
            }}
        >
            {/* Advanced Nebula Layers - Only visible on hover */}
            <motion.div
                animate={{
                    opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
                    scale: isHovered ? [1, 1.2, 1] : 0.8,
                    rotate: [0, 90, 180, 270, 360]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 }
                }}
                style={{
                    position: 'absolute',
                    inset: '-40px',
                    background: 'conic-gradient(from 0deg, transparent, rgba(176, 132, 255, 0.4), transparent, rgba(0, 255, 255, 0.3), transparent)',
                    borderRadius: '50%',
                    zIndex: -1,
                    filter: 'blur(30px)',
                    pointerEvents: 'none'
                }}
            />
            <motion.div
                animate={{
                    opacity: isHovered ? [0.4, 0.8, 0.4] : 0,
                    scale: isHovered ? [0.9, 1.1, 0.9] : 0.7,
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 }
                }}
                style={{
                    position: 'absolute',
                    inset: '-20px',
                    background: 'radial-gradient(circle, rgba(176, 132, 255, 0.5) 0%, rgba(126, 34, 206, 0) 70%)',
                    borderRadius: '50%',
                    zIndex: -1,
                    filter: 'blur(15px)',
                    pointerEvents: 'none'
                }}
            />

            <div style={{
                width: isMobile ? '250px' : '450px',
                height: isMobile ? '250px' : '450px',
                borderRadius: '40px',
                border: 'none',
                padding: '10px',
                background: 'rgba(10, 10, 25, 0.3)',
                boxShadow: isHovered ? '0 0 60px rgba(176, 132, 255, 0.4), inset 0 0 30px rgba(176, 132, 255, 0.2)' : 'none',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.4s ease'
            }}>
                <motion.img
                    src="./src/components/assets/profile.png"
                    alt="ManojRaj"
                    animate={{
                        opacity: isHovered ? 1 : 0.3,
                        scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '30px'
                    }}
                />

                {/* Enhanced Shimmer Effect - Only visible on hover */}
                <motion.div
                    animate={{
                        left: isHovered ? ['-100%', '200%'] : '-100%',
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{
                        left: { duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" },
                        opacity: { duration: 0.3 }
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                        transform: 'skewX(-25deg)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
            </div>
        </motion.div>
    );
};

export const Overlay = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();

        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <>
            {/* Global Styles for Animations */}
            <style>{`
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .project-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2.5rem;
                    padding-bottom: 4rem;
                }
                @media (min-width: 768px) {
                    .project-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                /* Gaming Input Styles */
                .gaming-input {
                    background: rgba(0, 0, 0, 0.6) !important;
                    border: 1px solid #333 !important;
                    color: #00ffff !important;
                    font-family: 'Courier New', monospace !important;
                    transition: all 0.3s ease !important;
                }
                .gaming-input:focus {
                    border-color: #00ffff !important;
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
                    outline: none !important;
                }
                input::placeholder, textarea::placeholder {
                    color: #555 !important;
                }
            `}</style>

            {/* 1) HERO - Moncy Style (Split Layout) */}
            <Section opacity={1}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(120, 50, 200, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                <div id="home" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }} />

                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'center' : 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '100vw',
                    margin: '0',
                    padding: isMobile ? '2rem 1rem' : '0 8%',
                    zIndex: 10,
                    minHeight: '100vh',
                    height: isMobile ? 'auto' : '100vh',
                    pointerEvents: 'none',
                    textAlign: isMobile ? 'center' : 'left'
                }}>

                    {/* LEFT SIDE: Name & Intro */}
                    <div style={{ textAlign: isMobile ? 'center' : 'left', pointerEvents: 'auto', maxWidth: '100%' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <StaggeredText
                                text="Hello! I'm"
                                style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#b084ff', fontWeight: '300', marginBottom: '0.5rem' }}
                            />
                            <h1 style={{
                                fontSize: 'clamp(2.5rem, 12vw, 6rem)',
                                lineHeight: '1.1',
                                letterSpacing: '0.02em',
                                fontWeight: '900',
                                color: '#fff',
                                fontFamily: "'Outfit', sans-serif",
                                textTransform: 'uppercase'
                            }}>
                                {portfolioData.personal.name.split("").map((char, i) => (
                                    <span key={i} style={{ color: (char === "M" || char === "R") ? "#b084ff" : "inherit" }}>
                                        {char}
                                    </span>
                                ))}
                            </h1>
                        </motion.div>
                    </div>

                    {/* SPACER FOR AVATAR */}
                    <div style={{ flex: isMobile ? '0.1' : 1, minHeight: isMobile ? '200px' : 'auto' }}></div>

                    {/* RIGHT SIDE: Role & Tagline */}
                    <div style={{ textAlign: isMobile ? 'center' : 'right', pointerEvents: 'auto', marginTop: isMobile ? '1rem' : '0' }}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: '300', marginBottom: '0.5rem' }}>
                                A Creative
                            </h3>
                            <div className="role-titles">
                                <h2 style={{
                                    fontSize: 'clamp(2rem, 10vw, 4rem)',
                                    fontWeight: '800',
                                    lineHeight: '1',
                                    color: 'transparent',
                                    WebkitTextStroke: '2px #b084ff', // Outline Effect
                                    margin: 0
                                }}>
                                    DEVELOPER
                                </h2>
                                <h2 style={{
                                    fontSize: 'clamp(2rem, 10vw, 4rem)',
                                    fontWeight: '800',
                                    lineHeight: '1',
                                    color: '#fff', // Filled
                                    margin: 0
                                }}>
                                    DESIGNER
                                </h2>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <MagneticButton onClick={() => window.scrollToSection ? window.scrollToSection('about') : document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                                    <div style={{
                                        padding: '1rem 2rem',
                                        border: '1px solid #b084ff',
                                        color: '#fff',
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        letterSpacing: '1px',
                                        background: 'rgba(176, 132, 255, 0.1)',
                                        display: 'inline-block'
                                    }}>
                                        EXPLORE WORK
                                    </div>
                                </MagneticButton>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </Section>

            {/* 2) ABOUT - Moncy Style (Minimalist + Glow) */}
            <Section opacity={1}>
                <div id="about" style={{ position: 'absolute', top: -100 }} />

                {/* Purple Glow Background */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10%',
                    transform: 'translateY(-50%)',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(160, 32, 240, 0.25) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isMobile ? '2rem' : '5rem',
                    zIndex: 10,
                    padding: isMobile ? '4rem 1rem' : '0 5%',
                    minHeight: '100vh'
                }}>
                    <AboutImage isMobile={isMobile} />

                    <div style={{
                        maxWidth: '700px',
                        textAlign: isMobile ? 'center' : 'left',
                    }}>
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <StaggeredText
                                text="About Me"
                                style={{
                                    color: '#b084ff',
                                    fontSize: '1rem',
                                    letterSpacing: '0.3em',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem',
                                    textTransform: 'uppercase'
                                }}
                            />

                            <h2 style={{
                                color: '#fff',
                                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                                lineHeight: '1.4',
                                fontWeight: '600',
                                marginBottom: '2rem'
                            }}>
                                I'm a creative developer & designer with a passion for blending <span style={{ color: '#b084ff' }}>technical expertise</span> with creative edge.
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            style={{ lineHeight: '1.8', color: '#ccc', fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '600px' }}
                        >
                            {portfolioData.personal.bio}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{ marginBottom: '2.5rem' }}
                        >
                            <MagneticButton onClick={() => {
                                console.log("Opening resume:", portfolioData.personal.resume);
                                window.open(portfolioData.personal.resume || '#', '_blank');
                            }}>
                                <motion.div
                                    whileHover="hover"
                                    initial="rest"
                                    animate="rest"
                                    style={{
                                        padding: '0.8rem 2.2rem',
                                        background: 'rgba(176, 132, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        fontFamily: "'Outfit', sans-serif",
                                        letterSpacing: '1px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(176, 132, 255, 0.3)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <motion.div
                                        variants={{
                                            hover: { opacity: 1, scale: 1.2 },
                                            rest: { opacity: 0, scale: 0.8 }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'radial-gradient(circle at center, rgba(176, 132, 255, 0.2) 0%, transparent 70%)',
                                            zIndex: 0,
                                            pointerEvents: 'none'
                                        }}
                                    />

                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>

                                    <span style={{ position: 'relative', zIndex: 1 }}>EXPLORE RESUME</span>

                                    <motion.div
                                        variants={{
                                            hover: { x: '200%' },
                                            rest: { x: '-100%' }
                                        }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '50%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                                            transform: 'skewX(-20deg)',
                                            zIndex: 2
                                        }}
                                    />
                                </motion.div>
                            </MagneticButton>
                        </motion.div>

                        {/* Education Minimal List */}
                        <div style={{ textAlign: 'left' }}>
                            {portfolioData.education.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    style={{
                                        marginBottom: '1.5rem',
                                        borderLeft: '2px solid #b084ff',
                                        paddingLeft: '1rem'
                                    }}
                                >
                                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>{edu.title}</div>
                                    <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.2rem' }}>{edu.institution} | {edu.period}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 3) SKILLS - KINETIC NEBULA VERSION */}
            <Section opacity={1}>
                <div id="skills" style={{ position: 'absolute', top: -100 }} />

                <div className="nebula-section-header">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="nebula-title"
                    >
                        THE SKILL<br /><span>SET</span>
                    </motion.h2>
                    <p className="nebula-description">Explore the field of expertise</p>
                </div>

                <SkillNebula isMobile={isMobile} />
            </Section>

            {/* 4) PROJECTS */}
            <Section opacity={1}>
                <div id="projects" style={{ position: 'absolute', top: -100 }} />
                <div style={{ width: '90%', maxWidth: '1400px', margin: '0 auto', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(2rem, 6vw, 4rem)',
                            fontWeight: '900',
                            color: 'var(--primary)',
                            letterSpacing: '5px',
                            textTransform: 'uppercase',
                            textShadow: '0 0 30px rgba(176, 132, 255, 0.3)'
                        }}>
                            Featured Projects
                        </h2>
                    </motion.div>
                    <div className="project-grid">
                        {portfolioData.projects.map((p, i) => (
                            <ProjectCard key={i} project={p} index={i} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* 5) CONTACT - MODERN CLASSIC UI */}
            <Section opacity={1}>
                <div id="contact" style={{ position: 'absolute', top: -100 }} />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
                    gap: isMobile ? '2.5rem' : '4rem',
                    width: '90%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    zIndex: 10,
                    position: 'relative',
                    alignItems: 'center'
                }}>
                    {/* LEFT: SOCIAL CARDS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <StaggeredText text="NETWORK_LINK" style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem', fontWeight: '900', letterSpacing: '4px' }} />
                        <SocialCard
                            icon="📧"
                            label="Direct Mail"
                            value={portfolioData.personal.email}
                            link={`mailto:${portfolioData.personal.email}`}
                            delay={0.1}
                        />
                        <SocialCard
                            icon="📞"
                            label="Call Line"
                            value={portfolioData.personal.phone}
                            link={`tel:${portfolioData.personal.phone}`}
                            delay={0.2}
                        />
                        <SocialCard
                            icon={<GitHubIcon />}
                            label="Source Control"
                            value={`@${portfolioData.personal.githubId}`}
                            link={`https://github.com/${portfolioData.personal.githubId}`}
                            delay={0.3}
                        />
                        <SocialCard
                            icon={<LinkedInIcon />}
                            label="Professional"
                            value="ManojRaj M"
                            link="https://linkedin.com/in/manojrajm"
                            delay={0.4}
                        />
                    </div>

                    {/* RIGHT: CONTACT FORM */}
                    <div className="glass" style={{
                        padding: '3.5rem',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: '800' }}>Get in touch</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Have a project in mind? Let's build something extraordinary.</p>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={(e) => e.preventDefault()}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                <input className="gaming-input" type="text" placeholder="Name" style={{ padding: '1.2rem', borderRadius: '16px' }} />
                                <input className="gaming-input" type="email" placeholder="Email" style={{ padding: '1.2rem', borderRadius: '16px' }} />
                            </div>
                            <textarea className="gaming-input" placeholder="Project Details" rows="4" style={{ padding: '1.2rem', borderRadius: '16px' }}></textarea>

                            <button style={{
                                width: '100%',
                                padding: '1.2rem',
                                background: 'linear-gradient(135deg, var(--primary) 0%, #7e22ce 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                letterSpacing: '1px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                boxShadow: '0 8px 20px rgba(176, 132, 255, 0.2)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(176, 132, 255, 0.4)';
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(176, 132, 255, 0.2)';
                                    e.currentTarget.style.filter = 'brightness(1)';
                                }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </Section>

            {/* 6) MODERN ANIMATED FOOTER */}
            <Section opacity={1}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '4rem 0',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* HUD SVG Decorations */}
                    <svg className="hud-line" style={{ position: 'absolute', top: '10%', left: 0, width: '100%', height: '2px', opacity: 0.1 }}>
                        <line x1="0" y1="0" x2="100%" y2="0" stroke="var(--primary)" strokeDasharray="10,10" />
                    </svg>
                    <svg className="hud-line" style={{ position: 'absolute', bottom: '20%', right: 0, width: '100%', height: '2px', opacity: 0.1 }}>
                        <line x1="0" y1="0" x2="100%" y2="0" stroke="var(--secondary)" strokeDasharray="10,10" />
                    </svg>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={{ position: 'relative' }}
                    >
                        <h2 className="liquid-text" style={{
                            fontSize: 'clamp(4rem, 15vw, 12rem)',
                            fontWeight: '900',
                            lineHeight: '0.9',
                            color: 'transparent',
                            WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                            position: 'relative',
                            cursor: 'default',
                            transition: 'all 0.5s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.WebkitTextStroke = '2px var(--primary)';
                                e.currentTarget.style.textShadow = '0 0 50px rgba(176, 132, 255, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'transparent';
                                e.currentTarget.style.WebkitTextStroke = '2px rgba(255,255,255,0.1)';
                                e.currentTarget.style.textShadow = 'none';
                            }}
                        >
                            SAY<br />HELLO
                        </h2>
                    </motion.div>

                    <div style={{
                        marginTop: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2.5rem',
                        zIndex: 20
                    }}>
                        {/* GitHub ID Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                color: 'var(--primary)',
                                fontWeight: '900',
                                fontSize: '1rem',
                                letterSpacing: '4px',
                                textTransform: 'uppercase',
                                padding: '0.5rem 1.5rem',
                                border: '1px solid rgba(176, 132, 255, 0.3)',
                                borderRadius: '4px',
                                background: 'rgba(176, 132, 255, 0.05)',
                                boxShadow: '0 0 20px rgba(176, 132, 255, 0.1)'
                            }}
                        >
                            <span style={{ opacity: 0.5 }}>GITHUB_ID //</span> {portfolioData.personal.githubId}
                        </motion.div>

                        <div style={{ display: 'flex', gap: '2rem' }}>

                            {['GitHub', 'LinkedIn', 'Twitter', 'Email'].map((social, i) => (
                                <MagneticButton key={social}>
                                    <motion.a
                                        href="#"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 + 0.5 }}
                                        style={{
                                            color: '#fff',
                                            fontSize: '1.2rem',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            opacity: 0.6,
                                            transition: 'opacity 0.3s',
                                            padding: '0.5rem 1rem',
                                            border: '1px solid transparent',
                                            borderRadius: '20px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                            e.currentTarget.style.color = 'var(--primary)';
                                            e.currentTarget.style.borderColor = 'rgba(176, 132, 255, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '0.6';
                                            e.currentTarget.style.color = '#fff';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                    >
                                        {social}
                                    </motion.a>
                                </MagneticButton>
                            ))}
                        </div>

                        {/* Back to Top Button */}
                        <MagneticButton onClick={() => window.scrollToSection ? window.scrollToSection('home') : window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '0.8rem',
                                    letterSpacing: '2px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>↑</span> BACK TO TOP
                            </motion.div>
                        </MagneticButton>
                    </div>

                    <div style={{
                        marginTop: '8rem',
                        width: '100%',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        <div className="ticker-wrap">
                            <div className="ticker">
                                <span>© 2026 {portfolioData.personal.name.toUpperCase()}  —  CREATIVE DEVELOPER  —  AVAILABLE FOR WORK  —  </span>
                                <span>© 2026 {portfolioData.personal.name.toUpperCase()}  —  CREATIVE DEVELOPER  —  AVAILABLE FOR WORK  —  </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Global Footer Animation Styles */}
            <style>{`
                .liquid-text {
                    animation: liquidRotate 12s ease-in-out infinite;
                    filter: contrast(120%) brightness(120%);
                }
                @keyframes liquidRotate {
                    0%, 100% { transform: translateY(0) scale(1) rotate(0deg); filter: hue-rotate(0deg); }
                    25% { transform: translateY(-5%) scale(1.02) rotate(-2deg); filter: hue-rotate(10deg); }
                    50% { transform: translateY(0) scale(1) rotate(0deg); filter: hue-rotate(0deg); }
                    75% { transform: translateY(5%) scale(0.98) rotate(2deg); filter: hue-rotate(-10deg); }
                }
                .hud-line {
                    animation: hudScan 5s linear infinite;
                }
                @keyframes hudScan {
                    0% { transform: translateX(-10%); opacity: 0.1; }
                    50% { opacity: 0.3; }
                    100% { transform: translateX(10%); opacity: 0.1; }
                }
                .ticker-wrap {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .ticker {
                    display: inline-block;
                    animation: ticker 20s linear infinite;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </>
    );
};
