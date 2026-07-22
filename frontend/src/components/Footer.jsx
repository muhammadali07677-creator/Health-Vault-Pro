import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Lock, CheckCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer
            style={{
                background: '#f8f8f8',
                borderTop: '1px solid rgba(0,0,0,0.07)',
                fontFamily: "'Hanken Grotesk', sans-serif",
            }}
        >
            <div
                className="mx-auto px-8 md:px-16 py-16"
                style={{ maxWidth: '1280px' }}
            >
                {/* 4-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
                    {/* Brand */}
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: '#ff5540', boxShadow: '0 2px 10px rgba(255,85,64,0.3)' }}
                            >
                                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 7H3L5 3L7 11L9 1L11 13L13 5L14.5 7H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span
                                className="font-display font-bold"
                                style={{ fontSize: '15px', color: '#ff5540' }}
                            >
                                HealthVault
                            </span>
                        </div>
                        <p
                            className="font-mono-label leading-relaxed"
                            style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.90)', lineHeight: 1.7 }}
                        >
                            Secure Medical Intelligence. Providing surgical precision in data management since 2026.
                        </p>
                    </div>

                    {/* Navigate */}
                    <div className="flex flex-col gap-4">
                        <h4
                            className="font-mono-label uppercase tracking-[0.15em]"
                            style={{ fontSize: '11px', color: '#131313', fontWeight: 700 }}
                        >
                            Navigate
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { label: 'Home',         path: '/'          },
                                { label: 'Features',     path: '/features'  },
                                { label: 'Doctor Reviews', path: '/ratings'   },
                                { label: 'Support',      path: '/support'   },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link
                                        to={l.path}
                                        className="font-mono-label transition-colors duration-200"
                                        style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', textDecoration: 'none' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff5540')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0, 0, 0, 0.95)')}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-4">
                        <h4
                            className="font-mono-label uppercase tracking-[0.15em]"
                            style={{ fontSize: '11px', color: '#131313', fontWeight: 700 }}
                        >
                            Company
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { label: 'About Us',     path: '/about'   },
                                { label: 'Our Mission',  path: '/mission' },
                                { label: 'Sign In',      path: '/login'   },
                                { label: 'Register',     path: '/signup'  },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link
                                        to={l.path}
                                        className="font-mono-label transition-colors duration-200"
                                        style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', textDecoration: 'none' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff5540')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0, 0, 0, 0.95)')}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-4">
                        <h4
                            className="font-mono-label uppercase tracking-[0.15em]"
                            style={{ fontSize: '11px', color: '#131313', fontWeight: 700 }}
                        >
                            Features
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { icon: <Zap size={12} />,          label: 'AI Report Comparison' },
                                { icon: <Lock size={12} />,         label: 'Encrypted Vaults'     },
                                { icon: <CheckCircle size={12} />,  label: 'HIPAA Compliance'     },
                            ].map((f) => (
                                <li
                                    key={f.label}
                                    className="flex items-center gap-2 font-mono-label"
                                    style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)' }}
                                >
                                    <span style={{ color: '#ff5540' }}>{f.icon}</span>
                                    {f.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
                >
                    <span
                        className="font-mono-label"
                        style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}
                    >
                        © 2026 HealthVault. Secure Medical Intelligence.
                    </span>
                    <div className="flex gap-6">
                        {['Terms of Service', 'Cookie Policy'].map((t) => (
                            <a
                                key={t}
                                href="#"
                                className="font-mono-label transition-colors duration-200"
                                style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)', textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff5540')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0, 0, 0, 0.80)')}
                            >
                                {t}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
