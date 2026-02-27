import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

    const handleNavClick = (item) => {
        setMenuOpen(false);
        if (window.scrollToSection) {
            window.scrollToSection(item.toLowerCase());
        } else {
            const el = document.getElementById(item.toLowerCase());
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            boxSizing: 'border-box',
            padding: '1.2rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 9999,
            background: 'rgba(5, 5, 16, 0.7)',
            backdropFilter: 'blur(15px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '35px', width: 'auto' }} />
                <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#fff', letterSpacing: '2px' }}>
                    MR<span style={{ color: 'var(--primary)' }}>.DEV</span>
                </div>
            </div>

            {/* Desktop Nav */}
            <nav className="desktop-nav">
                <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                    {navItems.map((item) => (
                        <li key={item}>
                            <a
                                href={`#${item.toLowerCase()}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                                style={{
                                    color: '#aaa',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '1px'
                                }}
                                onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.textShadow = '0 0 10px rgba(255,255,255,0.5)'; }}
                                onMouseOut={(e) => { e.target.style.color = '#aaa'; e.target.style.textShadow = 'none'; }}
                            >
                                {item.toUpperCase()}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Hamburger Button - Animated SVG */}
            <div className="mobile-menu-btn" onClick={toggleMenu} style={{ cursor: 'pointer', zIndex: 10001, width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <motion.line
                        x1="2" y1="6" x2="22" y2="6"
                        stroke="white" strokeWidth="2" strokeLinecap="round"
                        animate={menuOpen ? { y1: 6, y2: 18, x1: 6, x2: 18 } : { y1: 6, y2: 6, x1: 2, x2: 22 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.line
                        x1="2" y1="12" x2="22" y2="12"
                        stroke="white" strokeWidth="2" strokeLinecap="round"
                        animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.line
                        x1="2" y1="18" x2="22" y2="18"
                        stroke="white" strokeWidth="2" strokeLinecap="round"
                        animate={menuOpen ? { y1: 18, y2: 6, x1: 6, x2: 18 } : { y1: 18, y2: 18, x1: 2, x2: 22 }}
                        transition={{ duration: 0.3 }}
                    />
                </svg>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: 'circle(0% at 90% 5%)' }}
                        animate={{ opacity: 1, clipPath: 'circle(150% at 90% 5%)' }}
                        exit={{ opacity: 0, clipPath: 'circle(0% at 90% 5%)' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            height: '100vh',
                            background: 'rgba(5, 5, 20, 0.98)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 10000,
                            backdropFilter: 'blur(30px)'
                        }}
                    >
                        {navItems.map((item, i) => (
                            <motion.a
                                key={item}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: 0.2 + (i * 0.1),
                                    duration: 0.5
                                }}
                                onClick={() => handleNavClick(item)}
                                style={{
                                    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                                    fontWeight: '900',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    margin: '1rem 0',
                                    letterSpacing: '8px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'color 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = 'var(--primary)';
                                    e.target.style.textShadow = '0 0 30px rgba(176, 132, 255, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#fff';
                                    e.target.style.textShadow = 'none';
                                }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>


            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none; }
                    .mobile-menu-btn { display: flex; }
                }
                @media (min-width: 769px) {
                    .desktop-nav { display: block; }
                    .mobile-menu-btn { display: none; }
                }
            `}</style>
        </header>
    );
};

