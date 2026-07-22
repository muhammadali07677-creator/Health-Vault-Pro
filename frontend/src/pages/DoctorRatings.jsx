import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, User, MapPin, Stethoscope, Building,
    Send, Search, Filter, Activity, LogIn
} from 'lucide-react';

const labelStyle = {
    fontSize: '10px',
    color: 'rgba(0, 0, 0, 0.85)',
    display: 'block',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '6px',
    marginLeft: '4px',
};

const inputStyle = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 };

const SPECIALITIES = [
    "Cardiology", "Dermatology", "Neurology", "Orthopedics",
    "Pediatrics", "Psychiatry", "General Medicine", "Gynecology"
];

const StarRating = ({ value, hovered, onHover, onLeave, onClick, size = 28 }) =>
    <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map(s => (
            <button
                key={s}
                type="button"
                onClick={() => onClick(s)}
                onMouseEnter={() => onHover(s)}
                onMouseLeave={onLeave}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s' }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Star
                    size={size}
                    strokeWidth={1.5}
                    style={{
                        transition: 'color 0.15s, fill 0.15s',
                        fill: s <= (hovered || value) ? '#f59e0b' : 'transparent',
                        color: s <= (hovered || value) ? '#f59e0b' : 'rgba(0, 0, 0, 0.58)',
                    }}
                />
            </button>
        ))}
    </div>;

const MiniStars = ({ rating }) =>
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star
                key={s}
                size={11}
                strokeWidth={1.5}
                style={{
                    fill: s <= rating ? '#f59e0b' : 'transparent',
                    color: s <= rating ? '#f59e0b' : 'rgba(0, 0, 0, 0.58)',
                }}
            />
        ))}
    </div>;

const DoctorRatings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [formData, setFormData] = useState({
        doctorName: '', speciality: '', hospital: '', rating: 0, remarks: ''
    });

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reviews');
            setReviews(res.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) return alert('Please select a star rating');
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/reviews', { ...formData, patientName: user.name });
            await fetchReviews();
            setFormData({ doctorName: '', speciality: '', hospital: '', rating: 0, remarks: '' });
        } catch (err) {
            console.error('Submission failed:', err);
            alert(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    const normalize = (s) => String(s || '').toLowerCase().trim();

    const aggregated = reviews.reduce((acc, r) => {
        const key = `${normalize(r.doctorName)}|${normalize(r.hospital)}`;
        if (!acc[key]) acc[key] = { name: r.doctorName, speciality: r.speciality, hospital: r.hospital, totalRating: 0, count: 0, reviews: [] };
        acc[key].totalRating += Number(r.rating);
        acc[key].count += 1;
        acc[key].reviews.push(r);
        return acc;
    }, {});

    const sortedDoctors = Object.values(aggregated)
        .map(d => ({ ...d, average: (d.totalRating / d.count).toFixed(1) }))
        .sort((a, b) => b.average - a.average)
        .filter(d =>
            d.name.toLowerCase().includes(filter.toLowerCase()) ||
            d.speciality.toLowerCase().includes(filter.toLowerCase()) ||
            d.hospital.toLowerCase().includes(filter.toLowerCase())
        );

    return (
        <div className="relative min-h-screen pt-40 pb-24 overflow-hidden bg-white">
            <div className="mesh-bg" />
            <div className="max-w-6xl mx-auto px-8 md:px-16 relative z-10">

                {/* Page header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <p className="font-mono-label uppercase tracking-[0.14em] mb-3" style={{ fontSize: '11px', color: '#ff5540' }}>
                        Community
                    </p>
                    <h1
                        className="font-display tracking-tight mb-3"
                        style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, color: '#131313' }}
                    >
                        Doctor Reviews
                    </h1>
                    <div className="w-12 h-1 rounded-full mb-3" style={{ background: '#ff5540' }} />
                    <p style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.92)', marginBottom: '40px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        {reviews.length} verified patient reviews across our network.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* Submit form — login gate */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24"
                    >
                        {!user ? (
                            /* ── Not logged in: gate card ── */
                            <div
                                className="rounded-3xl p-8 flex flex-col items-center text-center gap-5"
                                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}>
                                    <Star size={24} />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold mb-2" style={{ fontSize: '18px', color: '#131313' }}>
                                        Sign in to Review
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6 }}>
                                        Only registered patients can submit doctor reviews. Sign in to share your experience.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="v1-btn-primary pill-btn w-full py-3.5 flex items-center justify-center gap-2"
                                    style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    <LogIn size={13} /> Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="v1-btn-outline pill-btn w-full py-3 flex items-center justify-center gap-2"
                                    style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    Create Account
                                </button>
                            </div>
                        ) : (
                            /* ── Logged in: review form ── */
                            <div
                                className="rounded-3xl p-8 relative overflow-hidden"
                                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
                            >
                                <div
                                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
                                    style={{ background: 'radial-gradient(circle, rgba(255,85,64,0.08) 0%, transparent 70%)' }}
                                />
                                <div className="relative">
                                    <h2 className="font-display mb-1" style={{ fontSize: '20px', fontWeight: 700, color: '#131313' }}>
                                        Rate a Doctor
                                    </h2>
                                    <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.90)', marginBottom: '24px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                        Share your experience with the community.
                                    </p>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label style={labelStyle}>Doctor Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                                    <User size={15} />
                                                </div>
                                                <input required value={formData.doctorName}
                                                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                                                    className="v1-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                                                    style={inputStyle} placeholder="Dr. John Doe" />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Speciality</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                                    <Stethoscope size={15} />
                                                </div>
                                                <input required list="specialities" value={formData.speciality}
                                                    onChange={e => setFormData({ ...formData, speciality: e.target.value })}
                                                    className="v1-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                                                    style={inputStyle} placeholder="General Physician" />
                                                <datalist id="specialities">
                                                    {SPECIALITIES.map(s => <option key={s} value={s} />)}
                                                </datalist>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Hospital / Clinic</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                                    <Building size={15} />
                                                </div>
                                                <input required value={formData.hospital}
                                                    onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                                                    className="v1-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                                                    style={inputStyle} placeholder="City Hospital" />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Your Rating</label>
                                            <div className="flex items-center justify-center py-4 rounded-2xl"
                                                style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.07)' }}>
                                                <StarRating value={formData.rating} hovered={hoveredStar}
                                                    onHover={setHoveredStar} onLeave={() => setHoveredStar(0)}
                                                    onClick={s => setFormData({ ...formData, rating: s })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Remarks</label>
                                            <textarea required value={formData.remarks}
                                                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                                className="v1-input w-full p-4 rounded-2xl text-sm resize-none"
                                                style={{ ...inputStyle, height: '100px' }}
                                                placeholder="Describe your experience..." />
                                        </div>
                                        <button type="submit" disabled={submitting}
                                            className="v1-btn-primary pill-btn w-full py-3.5 flex items-center justify-center gap-2"
                                            style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                                            {submitting
                                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                : <><Send size={13} /> Submit Review</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Doctor directory */}
                    <div className="flex-1 min-w-0">
                        {/* Search bar */}
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                                <Search size={16} />
                            </div>
                            <input
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                placeholder="Search by name, speciality, hospital…"
                                className="v1-input w-full pl-11 pr-5 py-3.5 rounded-2xl text-sm"
                                style={inputStyle}
                            />
                        </div>

                        {/* Cards */}
                        <div className="space-y-5">
                            <AnimatePresence>
                                {loading && (
                                    <div className="text-center py-20">
                                        <div className="w-8 h-8 border-2 border-[#ff5540]/20 border-t-[#ff5540] rounded-full animate-spin mx-auto mb-4" />
                                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}>
                                            Loading directory…
                                        </p>
                                    </div>
                                )}

                                {!loading && sortedDoctors.length === 0 && (
                                    <div className="text-center py-20">
                                        <Filter size={36} style={{ color: 'rgba(0, 0, 0, 0.60)', margin: '0 auto 12px' }} />
                                        <p style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.80)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                            No doctors found.
                                        </p>
                                    </div>
                                )}

                                {sortedDoctors.map((doc, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.06 }}
                                        className="rounded-3xl p-8 relative overflow-hidden"
                                        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
                                    >
                                        <div
                                            className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
                                            style={{ background: 'radial-gradient(circle, rgba(255,85,64,0.07) 0%, transparent 70%)' }}
                                        />

                                        <div className="relative">
                                            {/* Doctor header row */}
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                                        style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}
                                                    >
                                                        <Stethoscope size={22} />
                                                    </div>
                                                    <div>
                                                        <h3
                                                            className="font-display"
                                                            style={{ fontSize: '18px', fontWeight: 700, color: '#131313', marginBottom: '6px' }}
                                                        >
                                                            {doc.name}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span
                                                                className="flex items-center gap-1.5 font-mono-label uppercase tracking-[0.08em]"
                                                                style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.90)', background: '#f8f8f8', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.07)' }}
                                                            >
                                                                <Activity size={9} /> {doc.speciality}
                                                            </span>
                                                            <span
                                                                className="flex items-center gap-1.5 font-mono-label uppercase tracking-[0.08em]"
                                                                style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.90)', background: '#f8f8f8', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.07)' }}
                                                            >
                                                                <MapPin size={9} /> {doc.hospital}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Average rating badge */}
                                                <div
                                                    className="flex items-center gap-2 shrink-0 rounded-2xl px-4 py-2.5"
                                                    style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}
                                                >
                                                    <Star size={16} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                                                    <span
                                                        className="font-display"
                                                        style={{ fontSize: '20px', fontWeight: 700, color: '#131313', lineHeight: 1 }}
                                                    >
                                                        {doc.average}
                                                    </span>
                                                    <span
                                                        className="font-mono-label"
                                                        style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.80)', letterSpacing: '0.06em' }}
                                                    >
                                                        / {doc.count} reviews
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Individual reviews */}
                                            <div>
                                                <p className="font-mono-label uppercase tracking-[0.12em] mb-3" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.75)' }}>
                                                    Recent Feedback
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {doc.reviews.slice(0, 4).map((r, rIdx) => (
                                                        <div
                                                            key={rIdx}
                                                            className="rounded-2xl p-4"
                                                            style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.06)' }}
                                                        >
                                                            <div className="flex items-center justify-between mb-2.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                                                                        style={{ background: 'rgba(255,85,64,0.12)', color: '#ff5540' }}
                                                                    >
                                                                        <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                                                            {r.patientName?.[0]?.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                                                        {r.patientName}
                                                                    </span>
                                                                </div>
                                                                <MiniStars rating={r.rating} />
                                                            </div>
                                                            <p style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.6, fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>
                                                                "{r.remarks}"
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorRatings;
