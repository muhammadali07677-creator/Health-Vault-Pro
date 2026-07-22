import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut, User, ChevronDown, FileText, Brain,
    Star, Info, Target, HelpCircle, LayoutDashboard,
    Menu, X
} from 'lucide-react';

const PLATFORM_ITEMS = [
    { icon: <FileText size={16} />, label: 'HealthVault',      sub: 'Secure medical records',     path: '/features'  },
    { icon: <Brain    size={16} />, label: 'AI Comparison',     sub: 'Gemini-powered insights',    path: '/features'  },
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard',  sub: 'Your personal health hub',   path: '/features'  },
];

const COMPANY_ITEMS = [
    { icon: <Info   size={16} />, label: 'About Us',    path: '/about'   },
    { icon: <Target size={16} />, label: 'Our Mission', path: '/mission' },
    { icon: <HelpCircle size={16} />, label: 'Support', path: '/support' },
];

const Dropdown = ({ items, onClose }) => (
    <div
        className="absolute top-full mt-3 rounded-2xl overflow-hidden"
        style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.10)',
            minWidth: '220px',
            zIndex: 200,
        }}
    >
        {items.map((item) => (
            <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                style={{ textDecoration: 'none', display: 'block' }}
            >
                <div
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,85,64,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{ color: '#ff5540' }}>{item.icon}</span>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                            {item.label}
                        </div>
                        {item.sub && (
                            <div style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'JetBrains Mono', monospace", marginTop: '1px' }}>
                                {item.sub}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        ))}
    </div>
);

const NavDropdown = ({ label, items }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative" style={{ userSelect: 'none' }}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 transition-colors duration-200"
                style={{
                    background: 'none', border: 'none', borderBottom: '2px solid transparent',
                    cursor: 'pointer', padding: '0', paddingBottom: '2px',
                    fontSize: '15px', fontWeight: open ? 600 : 400,
                    color: open ? '#ff5540' : 'rgba(0, 0, 0, 0.95)',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    lineHeight: 1,
                }}
            >
                {label}
                <ChevronDown
                    size={13}
                    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', marginTop: '1px' }}
                />
            </button>
            {open && <Dropdown items={items} onClose={() => setOpen(false)} />}
        </div>
    );
};

const MobileMenu = ({ open, onClose, user, handleLogout, navigate }) => (
    <div
        className="fixed inset-0 z-[150] flex flex-col"
        style={{ background: '#ffffff', top: '64px' }}
    >
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24 space-y-1">
            <Link to="/features" onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <FileText size={16} style={{ color: '#ff5540' }} />
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>Platform</div>
            </Link>

            <p className="font-mono-label uppercase tracking-[0.12em] mt-6 mb-3" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.75)' }}>Doctor Reviews</p>
            <Link to="/ratings" onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <Star size={16} style={{ color: '#ff5540' }} />
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>Doctor Reviews</div>
            </Link>

            <p className="font-mono-label uppercase tracking-[0.12em] mt-6 mb-3" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.75)' }}>Company</p>
            {COMPANY_ITEMS.map(item => (
                <Link key={item.label} to={item.path} onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#ff5540' }}>{item.icon}</span>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{item.label}</div>
                </Link>
            ))}
        </div>

        <div className="px-8 pb-8 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
            {user ? (
                <div className="flex gap-3">
                    <button
                        onClick={() => { navigate(`/patient/${user.cnic}`); onClose(); }}
                        className="flex-1 v1-btn-outline pill-btn flex items-center justify-center gap-2"
                        style={{ padding: '12px 20px', fontSize: '12px' }}
                    >
                        <User size={14} /> My Profile
                    </button>
                    <button
                        onClick={() => { handleLogout(); onClose(); }}
                        className="v1-btn-outline pill-btn flex items-center gap-2"
                        style={{ padding: '12px 20px', fontSize: '12px' }}
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => { navigate('/login'); onClose(); }}
                    className="w-full v1-btn-primary pill-btn"
                    style={{ padding: '14px', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                    Sign In
                </button>
            )}
        </div>
    </div>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (paths) =>
        (Array.isArray(paths) ? paths : [paths]).some(p =>
            p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
        );

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full z-[100] transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.93)' : '#ffffff',
                    backdropFilter: scrolled ? 'blur(14px)' : 'none',
                    borderBottom: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
                }}
            >
                <div
                    className="flex justify-between items-center w-full px-8 md:px-16 mx-auto"
                    style={{ maxWidth: '1280px', height: '64px' }}
                >
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer shrink-0"
                        onClick={() => navigate('/')}
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: '#ff5540', boxShadow: '0 2px 10px rgba(255,85,64,0.3)' }}
                        >
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 7H3L5 3L7 11L9 1L11 13L13 5L14.5 7H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span
                            className="font-display font-bold tracking-tight leading-none"
                            style={{ fontSize: '17px', color: '#131313' }}
                        >
                            Health<span style={{ color: '#ff5540' }}>Vault</span>
                        </span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-7">
                        <Link
                            to="/"
                            style={{
                                fontSize: '15px', fontWeight: isActive('/') ? 600 : 400, textDecoration: 'none',
                                color: isActive('/') ? '#ff5540' : 'rgba(0, 0, 0, 0.95)',
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                borderBottom: isActive('/') ? '2px solid #ff5540' : '2px solid transparent',
                                paddingBottom: '2px', display: 'inline-flex', alignItems: 'center',
                            }}
                        >
                            Home
                        </Link>

                        <Link
                            to="/features"
                            style={{
                                fontSize: '15px', fontWeight: isActive('/features') ? 600 : 400, textDecoration: 'none',
                                color: isActive('/features') ? '#ff5540' : 'rgba(0, 0, 0, 0.95)',
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                borderBottom: isActive('/features') ? '2px solid #ff5540' : '2px solid transparent',
                                paddingBottom: '2px', display: 'inline-flex', alignItems: 'center',
                            }}
                        >
                            Platform
                        </Link>

                        <Link
                            to="/ratings"
                            style={{
                                fontSize: '15px', fontWeight: isActive('/ratings') ? 600 : 400, textDecoration: 'none',
                                color: isActive('/ratings') ? '#ff5540' : 'rgba(0, 0, 0, 0.95)',
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                borderBottom: isActive('/ratings') ? '2px solid #ff5540' : '2px solid transparent',
                                paddingBottom: '2px', display: 'inline-flex', alignItems: 'center',
                            }}
                        >
                            Doctor Reviews
                        </Link>

                        <NavDropdown label="Company" items={COMPANY_ITEMS} />
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <button
                                    onClick={() => navigate(`/patient/${user.cnic}`)}
                                    className="flex items-center gap-2 transition-all rounded-full px-4 py-2"
                                    style={{ background: 'rgba(255,85,64,0.08)', color: '#ff5540', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600 }}
                                >
                                    <User size={14} /> My Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="v1-btn-outline pill-btn flex items-center gap-2"
                                    style={{ padding: '8px 18px', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    <LogOut size={13} /> Out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link
                                    to="/login"
                                    style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.95)', textDecoration: 'none', fontFamily: "'Hanken Grotesk', sans-serif" }}
                                >
                                    Sign In
                                </Link>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="v1-btn-primary pill-btn"
                                    style={{ padding: '10px 22px', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    Get Started
                                </button>
                            </div>
                        )}

                        {/* Mobile burger */}
                        <button
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
                            style={{ background: mobileOpen ? 'rgba(255,85,64,0.08)' : 'transparent', border: 'none', cursor: 'pointer', color: mobileOpen ? '#ff5540' : '#131313' }}
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu overlay */}
            {mobileOpen && (
                <MobileMenu
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    user={user}
                    handleLogout={handleLogout}
                    navigate={navigate}
                />
            )}
        </>
    );
};

export default Navbar;
