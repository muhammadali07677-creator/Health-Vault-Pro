import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Phone, Calendar, ChevronRight, Activity, AlertCircle } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', cnic: '', password: '', role: 'patient',
        age: '', gender: 'Male', phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/signup', { ...formData });
            if (res.data.success) navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "v1-input w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm";
    const inputStyle = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 };
    const labelStyle = { fontSize: '10px', color: 'rgba(0, 0, 0, 0.85)', display: 'block', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', marginLeft: '4px' };

    return (
        <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-white px-6 py-24">
            <div className="mesh-bg" />

            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl relative z-10"
            >
                <div
                    className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
                    style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}
                >
                    <div
                        className="absolute -top-24 -right-24 w-56 h-56 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(255,85,64,0.10) 0%, transparent 70%)' }}
                    />

                    <div className="relative space-y-8">
                        <div className="text-center">
                            <h2
                                className="font-display tracking-tight"
                                style={{ fontSize: '28px', fontWeight: 700, color: '#131313' }}
                            >
                                Join the Network
                            </h2>
                            <p className="mt-2" style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.92)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                Create your patient profile to begin.
                            </p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 p-4 rounded-2xl text-sm"
                                    style={{ background: 'rgba(255,85,64,0.06)', border: '1px solid rgba(255,85,64,0.2)', color: '#ff5540', fontFamily: "'Hanken Grotesk', sans-serif" }}
                                >
                                    <AlertCircle size={16} className="shrink-0" /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div>
                                <label style={labelStyle}>Display Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <User size={15} />
                                    </div>
                                    <input name="name" required placeholder="Full Name" className={inputClass} style={inputStyle} onChange={handleChange} />
                                </div>
                            </div>

                            {/* CNIC */}
                            <div>
                                <label style={labelStyle}>National ID (CNIC)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <Activity size={15} />
                                    </div>
                                    <input name="cnic" required placeholder="00000-0000000-0" className={inputClass} style={inputStyle} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label style={labelStyle}>Secure Passcode</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <Lock size={15} />
                                    </div>
                                    <input type="password" name="password" required placeholder="••••••••" className={inputClass} style={inputStyle} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={labelStyle}>Mobile Contact</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <Phone size={15} />
                                    </div>
                                    <input name="phone" required placeholder="03XXXXXXXXX" className={inputClass} style={inputStyle} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Age */}
                            <div>
                                <label style={labelStyle}>Age</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                        <Calendar size={15} />
                                    </div>
                                    <input type="number" name="age" required placeholder="e.g. 25" className={inputClass} style={inputStyle} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label style={labelStyle}>Gender</label>
                                <select
                                    name="gender"
                                    onChange={handleChange}
                                    className="v1-input w-full px-4 py-3.5 rounded-2xl text-sm appearance-none"
                                    style={inputStyle}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="v1-btn-primary pill-btn col-span-full py-4 flex items-center justify-center gap-2 mt-2"
                                style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Complete Registration <ChevronRight size={14} /></>
                                )}
                            </button>
                        </form>

                        <div className="pt-5 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                Already a member?{' '}
                                <Link to="/login" style={{ color: '#ff5540', fontWeight: 700, textDecoration: 'none' }}>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
