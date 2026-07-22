import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ cnic: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/login', { ...formData });
            if (response.data.success) {
                login(response.data.user);
                navigate(`/patient/${response.data.user.cnic}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-white px-6 py-24">
            <div className="mesh-bg" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg relative z-10"
            >
                <div
                    className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
                    style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}
                >
                    {/* Red glow accent */}
                    <div
                        className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(255,85,64,0.12) 0%, transparent 70%)' }}
                    />

                    <div className="relative space-y-8 text-center">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ background: 'rgba(255,85,64,0.08)', border: '1px solid rgba(255,85,64,0.2)' }}
                            >
                                <Shield size={26} style={{ color: '#ff5540' }} />
                            </div>
                        </div>

                        {/* Heading */}
                        <div>
                            <h2
                                className="font-display tracking-tight"
                                style={{ fontSize: '28px', fontWeight: 700, color: '#131313' }}
                            >
                                Access Portal
                            </h2>
                            <p
                                className="mt-2"
                                style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.92)', fontFamily: "'Hanken Grotesk', sans-serif" }}
                            >
                                Enter your credentials to access your records.
                            </p>
                        </div>

                        {/* Error */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-3 p-4 rounded-2xl text-sm text-left"
                                    style={{ background: 'rgba(255,85,64,0.06)', border: '1px solid rgba(255,85,64,0.2)', color: '#ff5540', fontFamily: "'Hanken Grotesk', sans-serif" }}
                                >
                                    <AlertCircle size={16} className="shrink-0" /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            <div className="space-y-1.5">
                                <label
                                    className="font-mono-label uppercase tracking-[0.12em] ml-1"
                                    style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.85)', display: 'block' }}
                                >
                                    National ID (CNIC)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <Activity size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="00000-0000000-0"
                                        className="v1-input w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm"
                                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                                        value={formData.cnic}
                                        onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    className="font-mono-label uppercase tracking-[0.12em] ml-1"
                                    style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.85)', display: 'block' }}
                                >
                                    Secure Passcode
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="v1-input w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm"
                                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="v1-btn-primary pill-btn w-full py-4 flex items-center justify-center gap-2 mt-2"
                                style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Authenticate Profile <ArrowRight size={14} /></>
                                )}
                            </button>
                        </form>

                        <div className="pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                No profile?{' '}
                                <Link to="/signup" style={{ color: '#ff5540', fontWeight: 700, textDecoration: 'none' }}>
                                    Begin Registration
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
