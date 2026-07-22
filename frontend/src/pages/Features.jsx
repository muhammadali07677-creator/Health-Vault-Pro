import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Brain, Stethoscope, Shield, Upload,
    BarChart2, Bell, Lock, Users, Zap, Star, ChevronRight
} from 'lucide-react';

const FEATURES = [
    {
        icon: <FileText size={26} />,
        title: 'Digital Health Vault',
        desc: 'All your medical records — diagnoses, prescriptions, test orders, and history — stored in one secure, always-accessible vault.',
        tag: 'CORE',
    },
    {
        icon: <Brain size={26} />,
        title: 'AI Report Comparison',
        desc: 'Powered by Google Gemini. Select any two reports and get an instant intelligent comparison: what improved, what declined, and what stayed stable.',
        tag: 'AI',
        accent: true,
    },
    {
        icon: <Upload size={26} />,
        title: 'Smart Report Upload',
        desc: 'Upload PDFs or camera photos of your medical reports. Our system auto-parses and stores them with clean labels and timestamps.',
        tag: 'CORE',
    },
    {
        icon: <Stethoscope size={26} />,
        title: 'Doctor Access Portal',
        desc: 'Registered doctors can access patient profiles via CNIC to add diagnoses, prescriptions, and clinical notes in real time.',
        tag: 'CLINICAL',
    },
    {
        icon: <BarChart2 size={26} />,
        title: 'Health Trend Analytics',
        desc: 'Visual charts and trend lines built from your history — track how your metrics evolve across visits and reports over time.',
        tag: 'ANALYTICS',
    },
    {
        icon: <Star size={26} />,
        title: 'Doctor Reviews',
        desc: 'Rate and review healthcare providers. Find top-rated doctors filtered by speciality, hospital, and patient feedback.',
        tag: 'COMMUNITY',
    },
    {
        icon: <Shield size={26} />,
        title: 'Role-Based Security',
        desc: 'Separate secure access tiers for patients and doctors. Your data is never exposed beyond your explicit consent scope.',
        tag: 'SECURITY',
    },
    {
        icon: <Bell size={26} />,
        title: 'Medication Reminders',
        desc: 'Active prescriptions surface reminders so you never miss a dose. Medication tracking that fits your daily routine.',
        tag: 'CARE',
    },
    {
        icon: <Users size={26} />,
        title: 'Multi-Role Platform',
        desc: 'One platform for patients, doctors, and administrators. Each role sees exactly what they need — nothing more, nothing less.',
        tag: 'PLATFORM',
    },
];

const TAG_COLORS = {
    CORE:      { bg: 'rgba(0, 0, 0, 0.46)',      color: 'rgba(0, 0, 0, 0.90)'  },
    AI:        { bg: 'rgba(255,85,64,0.10)',      color: '#ff5540'             },
    CLINICAL:  { bg: 'rgba(59,130,246,0.08)',     color: '#3b82f6'             },
    ANALYTICS: { bg: 'rgba(16,185,129,0.08)',     color: '#10b981'             },
    COMMUNITY: { bg: 'rgba(245,158,11,0.08)',     color: '#f59e0b'             },
    SECURITY:  { bg: 'rgba(139,92,246,0.08)',     color: '#8b5cf6'             },
    CARE:      { bg: 'rgba(236,72,153,0.08)',     color: '#ec4899'             },
    PLATFORM:  { bg: 'rgba(14,165,233,0.08)',     color: '#0ea5e9'             },
};

const Features = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen pt-40 pb-24 overflow-hidden bg-white">
            <div className="mesh-bg" />
            <div className="max-w-6xl mx-auto px-8 md:px-16 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                    {/* Header */}
                    <div className="max-w-2xl mb-16">
                        <p
                            className="font-mono-label uppercase tracking-[0.14em] mb-4"
                            style={{ fontSize: '11px', color: '#ff5540' }}
                        >
                            Platform Capabilities
                        </p>
                        <h1
                            className="font-display tracking-tight mb-4"
                            style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, color: '#131313' }}
                        >
                            Everything you need,<br />nothing you don't.
                        </h1>
                        <div className="w-12 h-1 rounded-full mb-6" style={{ background: '#ff5540' }} />
                        <p style={{ fontSize: '17px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.75, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                            HealthVault is built around one principle: your medical data should be secure,
                            intelligent, and instantly accessible — whether you're a patient or a clinician.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        {FEATURES.map((f, i) => {
                            const tagStyle = TAG_COLORS[f.tag] || TAG_COLORS.CORE;
                            return (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: i * 0.05 }}
                                    className="glass-card rounded-2xl p-8 group relative overflow-hidden"
                                    style={f.accent ? { border: '1.5px solid rgba(255,85,64,0.25)' } : {}}
                                >
                                    {f.accent && (
                                        <div
                                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                                            style={{ background: 'radial-gradient(circle, rgba(255,85,64,0.10) 0%, transparent 70%)' }}
                                        />
                                    )}
                                    <div className="flex items-start justify-between mb-5">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}
                                        >
                                            {f.icon}
                                        </div>
                                        <span
                                            className="font-mono-label uppercase tracking-[0.1em]"
                                            style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '6px', background: tagStyle.bg, color: tagStyle.color }}
                                        >
                                            {f.tag}
                                        </span>
                                    </div>
                                    <h3 className="font-display mb-2" style={{ fontSize: '17px', fontWeight: 700, color: '#131313' }}>
                                        {f.title}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                        {f.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                        style={{ background: '#131313' }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(255,85,64,0.15) 0%, transparent 65%)' }}
                        />
                        <div className="relative">
                            <Zap size={28} style={{ color: '#ff5540', margin: '0 auto 16px' }} />
                            <h2
                                className="font-display tracking-tight mb-4"
                                style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: '#ffffff' }}
                            >
                                Ready to take control of your health data?
                            </h2>
                            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                Create your free account and access your entire medical history from anywhere.
                            </p>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="v1-btn-primary pill-btn flex items-center gap-2"
                                    style={{ padding: '14px 32px', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    Get Started <ChevronRight size={14} />
                                </button>
                                <button
                                    onClick={() => navigate('/ratings')}
                                    className="pill-btn flex items-center gap-2"
                                    style={{ padding: '13px 28px', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', cursor: 'pointer' }}
                                >
                                    View Reviews <Star size={13} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default Features;
