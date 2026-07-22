import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Stethoscope, ArrowRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden:  { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const FEATURES = [
    {
        icon: <Shield size={22} />,
        title: 'Bank-Grade Security',
        desc:  'Your medical history is protected with end-to-end multi-layer encryption and secure vaults. We prioritize zero-trust architecture.',
    },
    {
        icon: <Zap size={22} />,
        title: 'AI Report Comparison',
        desc:  'Compare two medical reports instantly using Google Gemini AI and get actionable clinical insights. Advanced pattern recognition in seconds.',
    },
    {
        icon: <Stethoscope size={22} />,
        title: 'Doctor–Patient Portal',
        desc:  'Doctors can add diagnoses, prescriptions, and tests. Patients can view their complete medical history through a secure, unified interface.',
    },
];

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-x-hidden bg-white text-[#131313]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <div className="mesh-bg" />

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative pt-40 pb-32 px-6 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
                {/* Subtle radial glow behind heart */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,85,64,0.10) 0%, transparent 70%)' }}
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center gap-6 relative z-10"
                >
                    {/* Display headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="font-display leading-[1.05] tracking-[-0.02em]"
                        style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700 }}
                    >
                        Health{' '}
                        <span
                            className="inline-block w-2 h-2 rounded-full align-middle mb-1"
                            style={{ background: '#ff5540', boxShadow: '0 0 8px rgba(255,85,64,0.5)' }}
                        />
                        <br />
                        Vault
                    </motion.h1>

                    {/* EKG + Heart visual */}
                    <motion.div
                        variants={itemVariants}
                        className="relative w-full flex items-center justify-center"
                        style={{ height: '280px' }}
                    >
                        {/* EKG SVG */}
                        <svg
                            viewBox="0 0 1200 200"
                            className="absolute w-full max-w-[1100px]"
                            style={{ height: '200px', overflow: 'visible' }}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="ekg-line"
                                d="M0 100H100 L120 60 L150 145 L180 28 L220 178 L250 100H450 L750 100H950 L980 44 L1010 156 L1050 12 L1090 188 L1120 72 L1150 124 L1170 100H1200"
                                stroke="#ff5540"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.7"
                            />
                        </svg>

                        {/* Heart */}
                        <div className="relative z-10 animate-heart-glow">
                            <svg width="180" height="180" viewBox="0 0 100 90" fill="#ff5540" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 85 C50 85 5 55 5 28 C5 14 17 5 30 5 C38 5 45 10 50 17 C55 10 62 5 70 5 C83 5 95 14 95 28 C95 55 50 85 50 85Z" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Subheadline */}
                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl leading-relaxed"
                        style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.95)', fontWeight: 400 }}
                    >
                        The most advanced medical records platform. Securely manage patient histories,
                        AI‑powered diagnostics, and clinical reports — all in one unified vault.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="v1-btn-primary pill-btn flex items-center gap-2"
                            style={{ padding: '14px 36px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                        >
                            Login Now <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="v1-btn-outline pill-btn"
                            style={{ padding: '14px 36px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                        >
                            Create Account
                        </button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 pt-10 w-full flex flex-wrap justify-center gap-x-16 gap-y-6"
                        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
                    >
                        {[
                            { value: '1500+', label: 'Active Patients' },
                            { value: '50+',   label: 'Doctors Online' },
                            { value: 'AI',    label: 'Powered Reports', accent: true },
                        ].map((s, i) => (
                            <React.Fragment key={s.label}>
                                {i > 0 && (
                                    <div className="hidden sm:block self-stretch w-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
                                )}
                                <div className="text-center">
                                    <p
                                        className="font-mono-label leading-none"
                                        style={{
                                            fontSize: '26px',
                                            fontWeight: 700,
                                            letterSpacing: '-0.02em',
                                            color: s.accent ? '#ff5540' : '#131313',
                                        }}
                                    >
                                        {s.value}
                                    </p>
                                    <p
                                        className="font-mono-label mt-2 uppercase tracking-[0.14em]"
                                        style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}
                                    >
                                        {s.label}
                                    </p>
                                </div>
                            </React.Fragment>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────────── */}
            <section className="px-6 md:px-16 pb-24 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURES.map((feat, i) => (
                        <motion.div
                            key={feat.title}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-card rounded-2xl p-9 flex flex-col gap-5 group"
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300"
                                style={{
                                    background: 'rgba(255,85,64,0.07)',
                                    border: '1px solid rgba(255,85,64,0.18)',
                                    color: '#ff5540',
                                }}
                            >
                                {feat.icon}
                            </div>
                            <h3
                                className="font-display leading-snug"
                                style={{ fontSize: '18px', fontWeight: 700 }}
                            >
                                {feat.title}
                            </h3>
                            <p
                                className="leading-relaxed"
                                style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.95)', fontWeight: 400 }}
                            >
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────── */}
            <section className="px-6 md:px-16 pb-28 max-w-[1280px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-3xl px-10 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8"
                    style={{
                        background: '#f5f5f5',
                        border: '1px solid rgba(0,0,0,0.07)',
                    }}
                >
                    {/* Gradient accent */}
                    <div
                        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
                        style={{ background: 'linear-gradient(to left, rgba(255,85,64,0.08), transparent)' }}
                    />

                    <div className="relative z-10 max-w-xl">
                        <h2
                            className="font-display leading-tight mb-3"
                            style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700 }}
                        >
                            Ready to secure your medical future?
                        </h2>
                        <p style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.95)', fontWeight: 400 }}>
                            Join over 1,500 active patients and experience the next generation of clinical intelligence.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/signup')}
                        className="v1-btn-primary pill-btn relative z-10 whitespace-nowrap"
                        style={{ padding: '16px 40px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                        Get Started Now
                    </button>
                </motion.div>
            </section>

            {/* ── MOBILE BOTTOM NAV ────────────────────────────────── */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 rounded-t-2xl"
                style={{
                    background: '#fff',
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                }}
            >
                {[
                    { label: 'Home',    path: '/' },
                    { label: 'Reports', path: '/login' },
                    { label: 'Maps',    path: '/login' },
                    { label: 'Vault',   path: '/login' },
                ].map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col items-center gap-0.5"
                        style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>·</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Landing;
