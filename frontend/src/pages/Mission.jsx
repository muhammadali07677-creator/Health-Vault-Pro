import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Cpu, TrendingUp } from 'lucide-react';

const Mission = () => (
    <div className="relative min-h-screen pt-40 pb-24 overflow-hidden bg-white">
        <div className="mesh-bg" />
        <div className="max-w-5xl mx-auto px-8 md:px-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                <h1
                    className="font-display tracking-tight mb-3"
                    style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, color: '#131313' }}
                >
                    Our Mission
                </h1>
                <div className="w-12 h-1 rounded-full mb-12" style={{ background: '#ff5540' }} />

                <div className="space-y-8">
                    {/* Mission Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className="rounded-3xl p-10 md:p-14 flex items-start gap-6"
                        style={{
                            background: '#f8f8f8',
                            border: '1px solid rgba(0,0,0,0.07)',
                            borderLeft: '5px solid #ff5540',
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(255,85,64,0.08)', border: '1px solid rgba(255,85,64,0.2)', color: '#ff5540' }}
                        >
                            <Target size={24} />
                        </div>
                        <div>
                            <h2 className="font-display mb-4" style={{ fontSize: '22px', fontWeight: 700, color: '#131313' }}>
                                Mission Statement
                            </h2>
                            <p style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.8, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                To digitally transform healthcare record management by providing a secure, intelligent,
                                and easy-to-use platform that empowers both doctors and patients. We believe that every
                                individual deserves instant, secure access to their complete medical history — anytime, anywhere.
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="rounded-3xl p-10 md:p-14 flex items-start gap-6"
                        style={{
                            background: '#f8f8f8',
                            border: '1px solid rgba(0,0,0,0.07)',
                            borderLeft: '5px solid rgba(0, 0, 0, 0.55)',
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(0, 0, 0, 0.50)', color: '#131313' }}
                        >
                            <Eye size={24} />
                        </div>
                        <div>
                            <h2 className="font-display mb-4" style={{ fontSize: '22px', fontWeight: 700, color: '#131313' }}>
                                Our Vision
                            </h2>
                            <p style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.8, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                A world where medical records are no longer scattered across paper files and disconnected
                                hospital systems. We envision a unified digital health ecosystem where AI assists doctors
                                in making faster diagnoses, patients track their health proactively, and clinical data
                                flows securely between all stakeholders.
                            </p>
                        </div>
                    </motion.div>

                    {/* Bottom cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: <Cpu size={22} />, title: 'AI-Driven Innovation', desc: 'We integrate Google Gemini AI to compare medical reports side-by-side, extracting insights that help doctors and patients understand health trends at a glance.' },
                            { icon: <TrendingUp size={22} />, title: 'Continuous Improvement', desc: 'HealthVault is constantly evolving. We are committed to adding new features such as appointment scheduling, telemedicine, and predictive health analytics.' },
                        ].map((card, i) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass-card rounded-2xl p-8"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
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
                </div>

            </motion.div>
        </div>
    </div>
);

export default Mission;
