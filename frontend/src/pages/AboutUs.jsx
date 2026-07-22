import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Globe, Heart } from 'lucide-react';

const CARDS = [
    { icon: <Shield size={22} />, title: 'Security First',       desc: 'Every piece of medical data is encrypted and stored in secure vaults with role-based access control.' },
    { icon: <Users size={22} />,  title: 'Doctor–Patient Bond',  desc: 'We empower doctors to manage clinical records while giving patients full visibility into their health journey.' },
    { icon: <Globe size={22} />,  title: 'Modern Platform',      desc: 'Built with React, Node.js, and Google Gemini AI — delivering a premium, responsive experience on every device.' },
    { icon: <Heart size={22} />,  title: 'Patient Centric',      desc: 'Every feature is designed around the patient experience — from uploading reports to tracking prescriptions.' },
];

const AboutUs = () => (
    <div className="relative min-h-screen pt-40 pb-24 overflow-hidden bg-white">
        <div className="mesh-bg" />
        <div className="max-w-5xl mx-auto px-8 md:px-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                {/* Page title */}
                <h1
                    className="font-display tracking-tight mb-3"
                    style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, color: '#131313' }}
                >
                    About Us
                </h1>
                <div className="w-12 h-1 rounded-full mb-12" style={{ background: '#ff5540' }} />

                {/* Who We Are */}
                <div
                    className="rounded-3xl p-10 md:p-14 mb-10"
                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.07)' }}
                >
                    <h2
                        className="font-display mb-5"
                        style={{ fontSize: '22px', fontWeight: 700, color: '#131313' }}
                    >
                        Who We Are
                    </h2>
                    <p className="leading-relaxed mb-4" style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        HealthVault is a next-generation medical records management platform designed to bridge the gap
                        between patients and healthcare providers. Our system allows doctors to securely record diagnoses,
                        prescriptions, and test orders while giving patients full transparency into their clinical history.
                    </p>
                    <p className="leading-relaxed" style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        Built with cutting-edge technology including AI-powered report comparison (powered by Google Gemini),
                        our platform transforms how medical data is stored, accessed, and analyzed — making healthcare smarter
                        and more accessible for everyone.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="glass-card rounded-2xl p-8 group"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-colors"
                                style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.18)', color: '#ff5540' }}
                            >
                                {card.icon}
                            </div>
                            <h3 className="font-display mb-2" style={{ fontSize: '17px', fontWeight: 700, color: '#131313' }}>
                                {card.title}
                            </h3>
                            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </motion.div>
        </div>
    </div>
);

export default AboutUs;
