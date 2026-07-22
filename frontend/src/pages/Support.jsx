import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, HelpCircle } from 'lucide-react';

const CONTACTS = [
    { icon: <Mail size={22} />,   title: 'Email Us',   info: 'support@healthvault.com', desc: 'Response within 24 hours' },
    { icon: <Phone size={22} />,  title: 'Call Us',    info: '+92 300 1234567',             desc: 'Mon–Fri, 9AM – 6PM PKT' },
    { icon: <MapPin size={22} />, title: 'Visit Us',   info: 'Islamabad, Pakistan',          desc: 'Head Office – Blue Area' },
];

const FAQS = [
    { q: 'How do I upload a medical report?',    a: 'Login to your patient profile, scroll to the "Sync Report" section on the right sidebar, label your report, and upload either a PDF or camera photo. It will be automatically converted and stored in your vault.' },
    { q: 'What is AI Report Comparison?',         a: 'Our AI-powered feature lets you select two medical reports and instantly compare them using Google Gemini. It extracts key metrics and tells you what has improved, worsened, or remained stable.' },
    { q: 'Can doctors add records to my profile?',a: 'Yes! Doctors who are registered on the platform can access your profile using your CNIC and add diagnoses, prescriptions, medications, and test orders directly.' },
    { q: 'Is my data secure?',                    a: 'Absolutely. All data is stored in encrypted vaults with role-based access. Only authorized users can view or modify your medical records.' },
    { q: 'How do I delete a report?',             a: 'Each report and history entry has a red trash icon. Click it, confirm the deletion, and the record will be permanently removed from your vault.' },
];

const Support = () => (
    <div className="relative min-h-screen pt-40 pb-24 overflow-hidden bg-white">
        <div className="mesh-bg" />
        <div className="max-w-5xl mx-auto px-8 md:px-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                <h1
                    className="font-display tracking-tight mb-3"
                    style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, color: '#131313' }}
                >
                    Support
                </h1>
                <div className="w-12 h-1 rounded-full mb-12" style={{ background: '#ff5540' }} />

                {/* Intro card */}
                <div
                    className="rounded-3xl p-10 md:p-14 mb-10"
                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.07)' }}
                >
                    <h2 className="font-display mb-4" style={{ fontSize: '22px', fontWeight: 700, color: '#131313' }}>
                        How Can We Help?
                    </h2>
                    <p style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.8, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        Whether you need help navigating the platform, have questions about uploading reports,
                        or want to learn more about our AI comparison feature — our team is here for you.
                        Reach out through any of the channels below.
                    </p>
                </div>

                {/* Contact cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    {CONTACTS.map((c, i) => (
                        <motion.div
                            key={c.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="glass-card rounded-2xl p-8 text-center"
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-5"
                                style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.18)', color: '#ff5540' }}
                            >
                                {c.icon}
                            </div>
                            <h3 className="font-display mb-1" style={{ fontSize: '16px', fontWeight: 700, color: '#131313' }}>
                                {c.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#ff5540', fontWeight: 600, marginBottom: '4px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                {c.info}
                            </p>
                            <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.80)' }}>
                                {c.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ */}
                <h2 className="font-display mb-6" style={{ fontSize: '22px', fontWeight: 700, color: '#131313' }}>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.06 }}
                            className="glass-card rounded-2xl p-6"
                        >
                            <div className="flex items-start gap-4">
                                <HelpCircle size={18} className="shrink-0 mt-0.5" style={{ color: '#ff5540' }} />
                                <div>
                                    <h4 className="font-display mb-2" style={{ fontSize: '15px', fontWeight: 700, color: '#131313' }}>
                                        {faq.q}
                                    </h4>
                                    <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </motion.div>
        </div>
    </div>
);

export default Support;
