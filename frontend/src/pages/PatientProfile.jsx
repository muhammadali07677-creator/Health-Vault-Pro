import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Plus, FileUp, Calendar, Stethoscope,
    Clipboard, ExternalLink, Camera, User, Download,
    Activity, AlertCircle, ShieldCheck, Microscope,
    Clock, Shield, Hash, MapPin, ChevronRight, UserCircle, X, Trash2, Star, CheckSquare, Square,
    LayoutDashboard, FolderOpen, GitBranch, PlusCircle, Menu, ChevronDown,
    Sparkles, TrendingUp, Pill, ScanLine, FlaskConical, Zap, CheckCircle2, TriangleAlert, Info,
    ShieldAlert, LogOut
} from 'lucide-react';

// ─── Shared style tokens ────────────────────────────────────────────────────
const labelSm = {
    fontSize: '10px', color: 'rgba(0,0,0,0.7)', display: 'block',
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em',
    textTransform: 'uppercase', marginBottom: '6px', marginLeft: '2px',
};
const inputCls = "v1-input w-full px-4 py-3 rounded-xl text-sm";
const inputSty = { fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 };
const card = {
    background: '#fff', border: '1px solid rgba(0,0,0,0.15)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
};
const surfaceCard = {
    background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.12)',
};

// Sidebar dark theme tokens
const sidebarBg = '#0f0f0f';
const sidebarBorder = 'rgba(255,255,255,0.07)';

// ─── Sidebar nav items ───────────────────────────────────────────────────────
const NAV = [
    { id: 'overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
    { id: 'reports', icon: <FolderOpen size={16} />, label: 'Lab Reports' },
    { id: 'history', icon: <GitBranch size={16} />, label: 'Mind-Map' },
    { id: 'new', icon: <PlusCircle size={16} />, label: 'New Record' },
];

// Mobile-only nav includes New Record; desktop right panel handles it
const NAV_DESKTOP = NAV.filter(n => n.id !== 'new');

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const SidebarContent = ({ active, setActive, setMobileOpen, patient, onSignOut, navItems }) => (
    <div className="flex flex-col h-full" style={{ background: sidebarBg }}>
        {/* Brand + Clinical Dashboard label */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#ff5540', boxShadow: '0 4px 14px rgba(255,85,64,0.35)' }}>
                    <Activity size={16} style={{ color: '#fff' }} />
                </div>
                <div>
                    <p className="font-display font-bold leading-tight" style={{ fontSize: '15px', color: '#fff' }}>
                        HealthVault
                    </p>
                </div>
            </div>
            <p className="font-mono-label uppercase tracking-[0.2em]" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}>
                Clinical Dashboard
            </p>
        </div>

        {/* Profile card */}
        <div className="px-4 py-4" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
            <div className="flex items-center gap-3 px-2 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,85,64,0.15)', border: '1px solid rgba(255,85,64,0.3)', color: '#ff5540' }}>
                    <User size={18} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-display font-bold truncate" style={{ fontSize: '13px', color: '#fff' }}>
                        {patient?.name || 'Patient'}
                    </p>
                    <p className="font-mono-label uppercase tracking-[0.1em] truncate" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
                        {patient?.cnic}
                    </p>
                </div>
            </div>
            <div className="flex gap-2 mt-3">
                <div className="flex-1 rounded-xl py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="font-mono-label" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reports</p>
                    <p className="font-display font-bold" style={{ fontSize: '19px', color: '#ff5540' }}>{patient?.testReports?.length || 0}</p>
                </div>
                <div className="flex-1 rounded-xl py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="font-mono-label" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>History</p>
                    <p className="font-display font-bold" style={{ fontSize: '19px', color: '#fff' }}>{patient?.medicalHistory?.length || 0}</p>
                </div>
            </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => { setActive(item.id); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                    style={{
                        background: active === item.id ? '#ff5540' : 'transparent',
                        color: active === item.id ? '#fff' : 'rgba(255,255,255,0.45)',
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '13px',
                        fontWeight: active === item.id ? 700 : 500,
                        cursor: 'pointer',
                        border: 'none',
                        letterSpacing: '0.03em',
                        boxShadow: active === item.id ? '0 4px 16px rgba(255,85,64,0.25)' : 'none',
                    }}
                    onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}
                >
                    <span style={{ opacity: active === item.id ? 1 : 0.7 }}>{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
            <div className="pt-4 space-y-2">
                {/* Support + Sign Out row */}
                <div className="flex items-center justify-between px-1 pt-2" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
                    <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 600 }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                        Support
                    </button>
                    <button
                        onClick={onSignOut}
                        className="flex items-center gap-1.5 transition-all"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 600 }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                        Sign Out <LogOut size={12} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Sidebar = ({ active, setActive, patient, mobileOpen, setMobileOpen, onSignOut }) => (
    <>
        {/* Desktop sidebar */}
        <aside
            className="hidden lg:flex flex-col w-64 shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto"
            style={{ background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, borderRadius: 0 }}
        >
            <SidebarContent active={active} setActive={setActive} setMobileOpen={setMobileOpen}
                patient={patient} onSignOut={onSignOut} navItems={NAV_DESKTOP} />
        </aside>

        {/* Mobile drawer overlay */}
        <AnimatePresence>
            {mobileOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <motion.aside
                        initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                        className="fixed left-0 top-0 z-[95] w-64 h-full lg:hidden"
                        style={{ background: sidebarBg }}
                    >
                        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
                            <p className="font-display font-bold" style={{ fontSize: '15px', color: '#ff5540' }}>HealthVault</p>
                            <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                                <X size={18} />
                            </button>
                        </div>
                        <SidebarContent active={active} setActive={setActive} setMobileOpen={setMobileOpen}
                            patient={patient} onSignOut={onSignOut} navItems={NAV} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    </>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, icon, children, action }) => (
    <div className="rounded-2xl overflow-hidden" style={card}>
        <div className="flex items-center justify-between px-7 py-5 bg-white" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-mono-label uppercase tracking-[0.18em] flex items-center gap-2.5"
                style={{ fontSize: '11px', color: '#000000', fontWeight: 700 }}>
                <span style={{ color: '#ff5540' }}>{icon}</span>
                {title}
            </h2>
            {action}
        </div>
        <div className="p-7">{children}</div>
    </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent }) => (
    <div className="rounded-xl px-5 py-4 flex flex-col" style={surfaceCard}>
        <p className="font-mono-label uppercase tracking-[0.15em] mb-2" style={{ fontSize: '9px', color: 'rgba(0,0,0,0.65)' }}>{label}</p>
        <p className="font-display font-bold" style={{ fontSize: '26px', color: accent ? '#ff5540' : '#000000', lineHeight: 1 }}>{value}</p>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const PatientProfile = () => {
    const { cnic } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [medicines, setMedicines] = useState([]);
    const [scannedFile, setScannedFile] = useState(null);
    const [prescribedTests, setPrescribedTests] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [comparing, setComparing] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [deleteSelectedReports, setDeleteSelectedReports] = useState([]);
    const [deleteSelectedHistory, setDeleteSelectedHistory] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [includeFoodAdvice, setIncludeFoodAdvice] = useState(true);
    const [expandedDisease, setExpandedDisease] = useState(null);
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [selectedVisitsForComparison, setSelectedVisitsForComparison] = useState([]);
    const [comparingVisits, setComparingVisits] = useState(false);
    const [visitComparisonResult, setVisitComparisonResult] = useState(null);
    const [showVisitComparisonModal, setShowVisitComparisonModal] = useState(false);

    // Feature 1 — Health Summary
    const [healthSummary, setHealthSummary] = useState(null);
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    // Feature 2 — Medicine Interactions
    const [interactionResult, setInteractionResult] = useState(null);
    const [checkingInteractions, setCheckingInteractions] = useState(false);
    const [showInteractionModal, setShowInteractionModal] = useState(false);

    // Feature 3 — Diagnosis Suggestion
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [gettingDiagnosis, setGettingDiagnosis] = useState(false);
    const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);

    // Feature 4 — Treatment Trend
    const [trendResult, setTrendResult] = useState(null);
    const [analyzingTrend, setAnalyzingTrend] = useState(false);
    const [trendDiseaseId, setTrendDiseaseId] = useState(null);
    const [showTrendModal, setShowTrendModal] = useState(false);

    // Feature 5 — Prescription Parser
    const [parsingPrescription, setParsingPrescription] = useState(false);
    const [parsedPrescription, setParsedPrescription] = useState(null);

    const fetchLock = React.useRef(false);

    const diseaseGroups = React.useMemo(() => {
        if (!patient || !patient.medicalHistory) return [];
        const groups = {};
        if (patient.diseaseNodes) {
            patient.diseaseNodes.forEach(node => {
                groups[node.id] = { id: node.id, disease: node.disease, createdAt: node.createdAt, visits: [] };
            });
        }
        patient.medicalHistory.forEach(visit => {
            const key = visit.diseaseId || visit.diagnosis || 'Unknown';
            if (!groups[key]) {
                groups[key] = { id: key, disease: visit.disease || visit.diagnosis || 'Unknown', createdAt: visit.date, visits: [] };
            }
            groups[key].visits.push({ ...visit, sortDate: new Date(visit.visitDate || visit.date) });
        });
        return Object.values(groups)
            .map(group => {
                group.visits.sort((a, b) => b.sortDate - a.sortDate);
                if (!group.createdAt && group.visits.length > 0) group.createdAt = group.visits[group.visits.length - 1].date;
                return group;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [patient]);

    useEffect(() => {
        if (fetchLock.current) return;
        fetchLock.current = true;
        const load = async () => {
            if (!cnic) { setLoading(false); return; }
            try {
                const res = await fetch(`http://localhost:5000/api/patients/${cnic}`);
                if (!res.ok) throw new Error(`${res.status}`);
                setPatient(await res.json());
            } catch (err) {
                console.error('Clinical Access Denied:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [cnic]);

    useEffect(() => { setSelectedVisitsForComparison([]); }, [expandedDisease]);

    // ── Upload helpers ──────────────────────────────────────────────────────
    const handleUpload = async (file, type) => {
        if (!file) return;
        setLoading(true);
        const customName = document.getElementById('reportName').value || 'Unnamed_Clinical_Report';
        let finalFile = file;
        if (type === 'image') {
            const doc = new jsPDF();
            const imgData = await new Promise(r => { const fr = new FileReader(); fr.onload = e => r(e.target.result); fr.readAsDataURL(file); });
            const img = new Image(); img.src = imgData; await new Promise(r => img.onload = r);
            const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
            const ratio = Math.min(pw / img.width, ph / img.height);
            doc.addImage(imgData, 'JPEG', (pw - img.width * ratio) / 2, 20, img.width * ratio, img.height * ratio);
            finalFile = new File([doc.output('blob')], `${customName}.pdf`, { type: 'application/pdf' });
        }
        const fd = new FormData();
        fd.append('file', finalFile);
        fd.append('requesterRole', user.role);
        fd.append('doctorName', user.role === 'doctor' ? user.name : '');
        fd.append('disease', customName);
        try {
            await axios.post(`http://localhost:5000/api/patients/${cnic}/reports`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            window.location.reload();
        } catch { alert('Sync failed.'); } finally { setLoading(false); }
    };

    const handleHistorySubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const form = e.target;
        const isNew = form.diseaseSelect.value === 'new';
        const fd = new FormData();
        fd.append('diseaseId', isNew ? 'new' : form.diseaseSelect.value);
        fd.append('disease', isNew ? form.newDiseaseName.value : form.diseaseSelect.options[form.diseaseSelect.selectedIndex].text);
        fd.append('visitDate', form.visitDate.value);
        fd.append('treatment', form.treatment.value);
        fd.append('hospitalName', form.hospitalName.value);
        fd.append('doctorName', user.role === 'doctor' ? user.name : form.doctorName.value);
        fd.append('medicines', JSON.stringify(medicines.filter(m => m.name.trim() !== '')));
        const toPdf = async (file) => {
            if (!file || !file.type.startsWith('image/')) return file;
            const doc = new jsPDF();
            const imgData = await new Promise(r => { const fr = new FileReader(); fr.onload = e => r(e.target.result); fr.readAsDataURL(file); });
            const img = new Image(); img.src = imgData; await new Promise(r => img.onload = r);
            const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
            const ratio = Math.min(pw / img.width, ph / img.height);
            doc.addImage(imgData, 'JPEG', (pw - img.width * ratio) / 2, 20, img.width * ratio, img.height * ratio);
            return new File([doc.output('blob')], `${file.name.split('.')[0]}_converted.pdf`, { type: 'application/pdf' });
        };
        const rxFile = await toPdf(form.prescriptionFile.files[0] || scannedFile);
        if (rxFile) fd.append('prescriptionFile', rxFile);
        const rptFile = await toPdf(form.testReportFile?.files[0]);
        if (rptFile) fd.append('testReportFile', rptFile);
        fd.append('reportName', form.reportName?.value || '');
        fd.append('reportDate', form.reportDate?.value || '');
        try {
            await axios.post(`http://localhost:5000/api/patients/${cnic}/history`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            window.location.reload();
        } catch { alert('Failed to commit record.'); } finally { setLoading(false); }
    };

    const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', duration: '', timing: [] }]);
    const updateMedicine = (i, f, v) => { const u = [...medicines]; u[i][f] = v; setMedicines(u); };
    const toggleTiming = (i, t) => { const u = [...medicines]; const ts = u[i].timing || []; u[i].timing = ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]; setMedicines(u); };
    const removeMedicine = (i) => { const u = [...medicines]; u.splice(i, 1); setMedicines(u); };
    const addTest = () => setPrescribedTests([...prescribedTests, '']);
    const updateTest = (i, v) => { const u = [...prescribedTests]; u[i] = v; setPrescribedTests(u); };
    const removeTest = (i) => { const u = [...prescribedTests]; u.splice(i, 1); setPrescribedTests(u); };

    const toggleReportSelection = (fp) => {
        setSelectedReports(prev => prev.includes(fp) ? prev.filter(p => p !== fp) : prev.length >= 2 ? prev : [...prev, fp]);
    };

    const runComparison = async () => {
        if (selectedReports.length !== 2) return;
        setComparing(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/compare-reports`, { report1Path: selectedReports[0], report2Path: selectedReports[1] });
            if (res.data.success) setComparisonResult(res.data.data);
        } catch { alert('Comparison failed.'); } finally { setComparing(false); }
    };

    const toggleVisitSelection = (e, visitId) => {
        e.stopPropagation();
        setSelectedVisitsForComparison(prev => prev.includes(visitId) ? prev.filter(id => id !== visitId) : [...prev, visitId]);
    };

    const runVisitComparison = async () => {
        if (selectedVisitsForComparison.length < 2) return;
        setComparingVisits(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/compare-visits`, { visitIds: selectedVisitsForComparison });
            if (res.data.success) { setVisitComparisonResult(res.data.data); setShowVisitComparisonModal(true); }
        } catch { alert('Visit comparison failed.'); } finally { setComparingVisits(false); }
    };

    const deleteReport = async (id) => {
        if (!window.confirm('Delete this report? Cannot be undone.')) return;
        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/patients/${cnic}/reports/${id}`);
            setPatient(prev => ({ ...prev, testReports: prev.testReports.filter(r => r.id !== id) }));
            setSelectedReports(prev => prev.filter(p => !patient.testReports.find(r => r.id === id && r.filePath === p)));
        } catch { alert('Delete failed.'); } finally { setLoading(false); }
    };

    const deleteHistoryRecord = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/patients/${cnic}/history/${id}`);
            setPatient(prev => ({ ...prev, medicalHistory: prev.medicalHistory.filter(h => h.id !== id) }));
        } catch { alert('Delete failed.'); } finally { setLoading(false); }
    };

    const toggleDeleteReport = (id) => setDeleteSelectedReports(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleDeleteHistory = (id) => setDeleteSelectedHistory(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const bulkDeleteReports = async () => {
        if (!window.confirm(`Delete ${deleteSelectedReports.length} report(s)?`)) return;
        setLoading(true);
        try {
            for (const id of deleteSelectedReports) await axios.delete(`http://localhost:5000/api/patients/${cnic}/reports/${id}`);
            setPatient(prev => ({ ...prev, testReports: prev.testReports.filter(r => !deleteSelectedReports.includes(r.id)) }));
            setDeleteSelectedReports([]); setSelectedReports([]);
        } catch { alert('Bulk delete failed.'); } finally { setLoading(false); }
    };

    const bulkDeleteHistory = async () => {
        if (!window.confirm(`Delete ${deleteSelectedHistory.length} record(s)?`)) return;
        setLoading(true);
        try {
            for (const id of deleteSelectedHistory) await axios.delete(`http://localhost:5000/api/patients/${cnic}/history/${id}`);
            setPatient(prev => ({ ...prev, medicalHistory: prev.medicalHistory.filter(h => !deleteSelectedHistory.includes(h.id)) }));
            setDeleteSelectedHistory([]);
        } catch { alert('Bulk delete failed.'); } finally { setLoading(false); }
    };

    const handleAnalyze = async (reportPathOrRec, type) => {
        setAnalyzing(true); setAnalysisResult(null); setShowAnalysisModal(true);
        let reportPath = reportPathOrRec;
        if (typeof reportPathOrRec === 'object' && reportPathOrRec !== null) {
            reportPath = type === 'prescription' ? reportPathOrRec.prescriptionAttachment : (reportPathOrRec.reportAttachment || null);
        }
        if (!reportPath) { alert('No file to analyze.'); setShowAnalysisModal(false); setAnalyzing(false); return; }
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/analyze-report`, { reportPath, includeFoodAdvice });
            if (res.data.success) setAnalysisResult(res.data.data);
        } catch { alert('Analysis failed.'); setShowAnalysisModal(false); } finally { setAnalyzing(false); }
    };

    // ── Feature 1: Health Summary ───────────────────────────────────────────
    const handleGenerateSummary = async () => {
        setGeneratingSummary(true); setHealthSummary(null); setShowSummaryModal(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/health-summary`);
            if (res.data.success) setHealthSummary(res.data.data);
        } catch { alert('Health summary failed.'); setShowSummaryModal(false); } finally { setGeneratingSummary(false); }
    };

    // ── Feature 2: Medicine Interactions ────────────────────────────────────
    const handleCheckInteractions = async () => {
        const valid = medicines.filter(m => m.name.trim() !== '');
        if (valid.length < 2) { alert('Add at least 2 medicines to check interactions.'); return; }
        setCheckingInteractions(true); setInteractionResult(null); setShowInteractionModal(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/check-interactions`, { medicines: valid });
            if (res.data.success) setInteractionResult(res.data.data);
        } catch { alert('Interaction check failed.'); setShowInteractionModal(false); } finally { setCheckingInteractions(false); }
    };

    // ── Feature 3: Diagnosis Suggestion ─────────────────────────────────────
    const handleDiagnosisSuggest = async (reportPath) => {
        if (!reportPath) { alert('No file to diagnose.'); return; }
        setGettingDiagnosis(true); setDiagnosisResult(null); setShowDiagnosisModal(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/diagnosis-suggestion`, { reportPath });
            if (res.data.success) setDiagnosisResult(res.data.data);
        } catch { alert('Diagnosis suggestion failed.'); setShowDiagnosisModal(false); } finally { setGettingDiagnosis(false); }
    };

    // ── Feature 4: Treatment Trend ───────────────────────────────────────────
    const runTreatmentTrend = async (group) => {
        setAnalyzingTrend(true); setTrendResult(null); setTrendDiseaseId(group.id); setShowTrendModal(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/treatment-trend`, { diseaseId: group.id });
            if (res.data.success) setTrendResult(res.data.data);
        } catch { alert('Trend analysis failed.'); setShowTrendModal(false); } finally { setAnalyzingTrend(false); }
    };

    // ── Feature 5: Prescription Parser ──────────────────────────────────────
    const parsePrescription = async (file) => {
        if (!file) return;
        setParsingPrescription(true); setParsedPrescription(null); setScannedFile(file);
        const fd = new FormData();
        fd.append('prescriptionImage', file);
        try {
            const res = await axios.post(`http://localhost:5000/api/patients/${cnic}/parse-prescription`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.success) {
                const data = res.data.data;
                setParsedPrescription(data);
                // Auto-fill medicines from parsed result
                if (data.medicines && data.medicines.length > 0) {
                    setMedicines(data.medicines.map(m => ({
                        name: m.name || '',
                        dosage: m.dosage || '',
                        duration: m.duration || '',
                        timing: (m.timing || []).map(t => t.toUpperCase()),
                    })));
                }
                // Auto-fill doctor/hospital if the form fields exist
                if (data.doctorName) {
                    const dnField = document.querySelector('input[name="doctorName"]');
                    if (dnField && !dnField.value) dnField.value = data.doctorName;
                }
                if (data.hospitalName) {
                    const hnField = document.querySelector('input[name="hospitalName"]');
                    if (hnField && !hnField.value) hnField.value = data.hospitalName;
                }
            }
        } catch { alert('Prescription parsing failed.'); } finally { setParsingPrescription(false); }
    };

    // ── Loading / error states ──────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-10 h-10 border-2 border-[#ff5540]/20 border-t-[#ff5540] rounded-full animate-spin mb-4" />
            <p className="font-mono-label uppercase tracking-[0.2em]" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}>Loading vault…</p>
        </div>
    );

    if (!patient) return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-white">
            <div className="max-w-sm w-full rounded-3xl p-12 text-center" style={card}>
                <AlertCircle size={48} className="mx-auto mb-5" style={{ color: '#ff5540' }} />
                <h2 className="font-display font-bold mb-2" style={{ fontSize: '22px', color: '#131313' }}>Access Denied</h2>
                <p className="mb-6" style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    Could not locate the requested clinical profile.
                </p>
                <button onClick={() => window.history.back()} className="v1-btn-primary pill-btn w-full py-3"
                    style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                    Go Back
                </button>
            </div>
        </div>
    );

    // ── Overview panel ──────────────────────────────────────────────────────
    const OverviewPanel = () => (
        <div className="space-y-6">
            {/* Hero identity card */}
            <div className="rounded-2xl p-8 md:p-10 relative overflow-hidden" style={card}>
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 80% 10%, rgba(255,85,64,0.05) 0%, transparent 55%)', transform: 'translate(20%, -30%)' }} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                    {/* Left: avatar + patient info */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 relative"
                            style={{ background: '#fff', border: '1px solid rgba(255,85,64,0.12)', boxShadow: '0 6px 24px rgba(255,85,64,0.08)', color: '#ff5540' }}>
                            <User size={36} />
                            <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full"
                                style={{ background: 'rgba(255,85,64,0.06)', border: '1px solid rgba(255,85,64,0.15)' }}>
                                <span className="font-mono-label uppercase tracking-[0.18em]" style={{ fontSize: '9px', color: '#ff5540' }}>
                                    {patient.testReports?.length > 0 ? 'Synced Profile' : 'Unsynchronized Profile'}
                                </span>
                            </div>
                            <h1 className="font-display font-bold tracking-tight" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', color: '#131313', lineHeight: 1.1 }}>
                                {patient.name}
                            </h1>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {[
                                    { icon: <Hash size={9} />, text: patient.cnic },
                                    { icon: <Calendar size={9} />, text: `${patient.age} yrs` },
                                    { icon: <User size={9} />, text: patient.gender },
                                ].map((chip, i) => (
                                    <span key={i} className="flex items-center gap-1.5 font-mono-label uppercase tracking-[0.08em]"
                                        style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.90)', background: '#f5f5f5', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                        <span style={{ color: '#ff5540' }}>{chip.icon}</span> {chip.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: circular stat rings */}
                    <div className="flex gap-5 shrink-0">
                        {[
                            { label: 'Reports', value: patient.testReports?.length || 0, accent: true },
                            { label: 'History', value: patient.medicalHistory?.length || 0, accent: false },
                        ].map(({ label, value, accent }) => (
                            <div key={label} className="flex flex-col items-center justify-center relative"
                                style={{ width: 100, height: 100, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                                <p className="font-mono-label uppercase tracking-[0.12em] absolute top-5"
                                    style={{ fontSize: '8px', color: 'rgba(0, 0, 0, 0.75)', letterSpacing: '0.12em' }}>{label}</p>
                                <p className="font-display font-bold" style={{ fontSize: '28px', color: accent ? '#ff5540' : '#131313', lineHeight: 1, marginTop: 8 }}>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Lab Reports" value={patient.testReports?.length || 0} accent />
                <StatCard label="Conditions" value={diseaseGroups.length} />
                <StatCard label="Total Visits" value={patient.medicalHistory?.length || 0} />
                <StatCard label="Medicines" value={patient.medicalHistory?.reduce((a, h) => a + (h.medicines?.length || 0), 0) || 0} />
            </div>

            {/* Recent activity — 2×2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Latest report */}
                <div className="rounded-3xl p-6" style={card}>
                    <p className="font-mono-label uppercase tracking-[0.12em] mb-4" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.80)' }}>Latest Report</p>
                    {patient.testReports?.length > 0 ? (() => {
                        const r = [...patient.testReports].reverse()[0];
                        return (
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}>
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-display font-bold truncate" style={{ fontSize: '14px', color: '#131313' }}>{r.diseaseCause}</p>
                                    <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>
                                        {new Date(r.uploadDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <a href={`http://localhost:5000${r.filePath}`} target="_blank" rel="noreferrer"
                                    style={{ color: '#ff5540', display: 'flex' }}>
                                    <ExternalLink size={15} />
                                </a>
                            </div>
                        );
                    })() : <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.75)', fontFamily: "'Hanken Grotesk', sans-serif" }}>No reports yet.</p>}
                </div>

                {/* Latest visit */}
                <div className="rounded-3xl p-6" style={card}>
                    <p className="font-mono-label uppercase tracking-[0.12em] mb-4" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.80)' }}>Latest Visit</p>
                    {patient.medicalHistory?.length > 0 ? (() => {
                        const h = [...patient.medicalHistory].sort((a, b) => new Date(b.visitDate || b.date) - new Date(a.visitDate || a.date))[0];
                        return (
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', color: '#131313' }}>
                                    <Stethoscope size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-display font-bold truncate" style={{ fontSize: '14px', color: '#131313' }}>{h.disease || h.diagnosis}</p>
                                    <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>
                                        {h.doctorName} · {new Date(h.visitDate || h.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })() : <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.75)', fontFamily: "'Hanken Grotesk', sans-serif" }}>No visits yet.</p>}
                </div>

                {/* Lab Repository mini-preview */}
                <div className="rounded-3xl p-6" style={card}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.80)' }}>Lab Repository</p>
                        <button onClick={() => setActiveSection('reports')}
                            className="flex items-center gap-1 font-mono-label uppercase tracking-[0.08em]"
                            style={{ fontSize: '9px', color: '#ff5540', background: 'none', border: 'none', cursor: 'pointer' }}>
                            View All <ChevronRight size={10} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}>
                            <FolderOpen size={18} />
                        </div>
                        <div>
                            <p className="font-display font-bold" style={{ fontSize: '22px', color: '#ff5540', lineHeight: 1 }}>{patient.testReports?.length || 0}</p>
                            <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>archived reports</p>
                        </div>
                    </div>
                    {patient.testReports?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {[...patient.testReports].reverse().slice(0, 3).map((r, i) => (
                                <span key={i} style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.95)', background: '#f8f8f8', padding: '3px 9px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.07)', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                                    {r.diseaseCause}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mind-Map mini-preview */}
                <div className="rounded-3xl p-6" style={card}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.80)' }}>Mind-Map</p>
                        <button onClick={() => setActiveSection('history')}
                            className="flex items-center gap-1 font-mono-label uppercase tracking-[0.08em]"
                            style={{ fontSize: '9px', color: '#131313', background: 'none', border: 'none', cursor: 'pointer' }}>
                            View All <ChevronRight size={10} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', color: '#131313' }}>
                            <GitBranch size={18} />
                        </div>
                        <div>
                            <p className="font-display font-bold" style={{ fontSize: '22px', color: '#131313', lineHeight: 1 }}>{diseaseGroups.length}</p>
                            <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>conditions tracked</p>
                        </div>
                    </div>
                    {diseaseGroups.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {diseaseGroups.slice(0, 2).map((g, i) => (
                                <span key={i} style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.95)', background: '#f8f8f8', padding: '3px 9px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.07)', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
                                    {g.disease}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Health Summary */}
            <div className="rounded-3xl overflow-hidden" style={card}>
                <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}>
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h2 className="font-display font-bold" style={{ fontSize: '17px', color: '#000000' }}>AI Health Brief</h2>
                            <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0,0,0,0.65)' }}>Gemini 2.5 Flash · Full Profile Summary</p>
                        </div>
                    </div>
                    <button onClick={handleGenerateSummary} disabled={generatingSummary}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
                        style={{ background: '#000000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', opacity: generatingSummary ? 0.6 : 1 }}>
                        {generatingSummary ? <><Activity size={12} className="animate-spin" /> Generating…</> : <><Sparkles size={12} /> Generate</>}
                    </button>
                </div>
                <div className="p-8">
                    {healthSummary ? (
                        <div className="space-y-5">
                            <p style={{ fontSize: '15px', color: '#000000', lineHeight: 1.75, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{healthSummary.headline}</p>
                            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.75)', lineHeight: 1.75, fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{healthSummary.paragraph}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {healthSummary.activeConditions?.length > 0 && (
                                    <div className="rounded-2xl p-4" style={surfaceCard}>
                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ fontSize: '9px', color: '#ff5540' }}><Activity size={9} /> Active Conditions</p>
                                        <div className="flex flex-wrap gap-1.5">{healthSummary.activeConditions.map((c, i) => (
                                            <span key={i} style={{ fontSize: '11px', color: '#131313', background: '#fff', padding: '3px 9px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.09)', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{c}</span>
                                        ))}</div>
                                    </div>
                                )}
                                {healthSummary.riskFlags?.length > 0 && (
                                    <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.14)' }}>
                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ fontSize: '9px', color: '#ef4444' }}><TriangleAlert size={9} /> Risk Flags</p>
                                        <ul className="space-y-1">{healthSummary.riskFlags.map((r, i) => (
                                            <li key={i} style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>• {r}</li>
                                        ))}</ul>
                                    </div>
                                )}
                                {healthSummary.positives?.length > 0 && (
                                    <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.14)' }}>
                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ fontSize: '9px', color: '#22c55e' }}><CheckCircle2 size={9} /> Positives</p>
                                        <ul className="space-y-1">{healthSummary.positives.map((p, i) => (
                                            <li key={i} style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>• {p}</li>
                                        ))}</ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <Sparkles size={30} style={{ color: 'rgba(0, 0, 0, 0.55)', margin: '0 auto 10px' }} />
                            <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.75)', fontFamily: "'Hanken Grotesk', sans-serif" }}>Click Generate to produce an AI health brief from your complete medical history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // ── Sync report card (shared between overview + new record sidebar) ─────
    const SyncReportCard = () => (
        <Section title="SyncReport" icon={<Camera size={14} />}>
            <div className="space-y-5">
                <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6 }}>
                    Sync your laboratory results to the clinical cloud through instant scanning.
                </p>
                <div>
                    <label style={labelSm}>Diagnostic Label</label>
                    <input id="reportName" type="text" placeholder="E.G. HEMATOLOGY REPORT"
                        className={inputCls} style={{ ...inputSty, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.06em' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col items-center justify-center gap-3 py-6 rounded-xl cursor-pointer transition-all group"
                        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,85,64,0.3)'; e.currentTarget.style.background = 'rgba(255,85,64,0.03)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = '#fff'; }}
                    >
                        <FileText size={22} style={{ color: 'rgba(0, 0, 0, 0.70)' }} />
                        <span className="font-mono-label uppercase tracking-[0.15em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 700 }}>Digital PDF</span>
                        <input type="file" accept="application/pdf" className="hidden" onChange={e => handleUpload(e.target.files[0], 'pdf')} />
                    </label>
                    <label className="flex flex-col items-center justify-center gap-3 py-6 rounded-xl cursor-pointer transition-all"
                        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,85,64,0.3)'; e.currentTarget.style.background = 'rgba(255,85,64,0.03)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = '#fff'; }}
                    >
                        <Camera size={22} style={{ color: 'rgba(0, 0, 0, 0.70)' }} />
                        <span className="font-mono-label uppercase tracking-[0.15em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 700 }}>USB Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files[0], 'image')} />
                    </label>
                </div>
            </div>
        </Section>
    );

    // ── Lab Reports panel ───────────────────────────────────────────────────
    const ReportsPanel = () => (
        <div className="space-y-6">
            {SyncReportCard()}
            <Section
                title="Laboratory Repository"
                icon={<FolderOpen size={16} />}
                action={
                    <div className="flex items-center gap-2">
                        {deleteSelectedReports.length > 0 && (
                            <button onClick={bulkDeleteReports}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all"
                                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                <Trash2 size={12} /> Delete ({deleteSelectedReports.length})
                            </button>
                        )}
                        <button
                            onClick={runComparison}
                            disabled={selectedReports.length !== 2 || comparing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all"
                            style={{
                                background: selectedReports.length === 2 && !comparing ? '#ff5540' : '#f8f8f8',
                                color: selectedReports.length === 2 && !comparing ? '#fff' : 'rgba(0, 0, 0, 0.80)',
                                border: '1px solid transparent', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: selectedReports.length === 2 ? 'pointer' : 'not-allowed',
                            }}>
                            {comparing ? <><Activity size={12} className="animate-spin" /> Analyzing…</>
                                : <><Activity size={12} /> AI Compare ({selectedReports.length}/2)</>}
                        </button>
                    </div>
                }
            >
                {patient.testReports?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...patient.testReports].reverse().map((report, idx) => {
                            const sel = selectedReports.includes(report.filePath);
                            const delSel = deleteSelectedReports.includes(report.id);
                            return (
                                <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                                    onClick={() => toggleReportSelection(report.filePath)}
                                    className="flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all"
                                    style={{
                                        background: sel ? 'rgba(255,85,64,0.06)' : '#f8f8f8',
                                        border: sel ? '1.5px solid rgba(255,85,64,0.3)' : '1px solid rgba(0,0,0,0.07)',
                                    }}>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: sel ? '#ff5540' : 'rgba(255,85,64,0.08)', color: sel ? '#fff' : '#ff5540', border: '1px solid rgba(255,85,64,0.15)', position: 'relative' }}>
                                        <FileText size={16} />
                                        {sel && <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#ff5540', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 700 }}>✓</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-display font-bold truncate" style={{ fontSize: '13px', color: sel ? '#ff5540' : '#131313' }}>
                                            {report.diseaseCause}
                                        </p>
                                        <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)', marginTop: 2 }}>
                                            {new Date(report.uploadDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => toggleDeleteReport(report.id)}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: delSel ? 'rgba(239,68,68,0.12)' : 'transparent', color: delSel ? '#ef4444' : 'rgba(0, 0, 0, 0.70)', border: '1px solid ' + (delSel ? 'rgba(239,68,68,0.2)' : 'transparent'), cursor: 'pointer' }}>
                                            {delSel ? <CheckSquare size={12} /> : <Square size={12} />}
                                        </button>
                                        <button onClick={() => handleAnalyze(report.filePath)}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(255,85,64,0.07)', color: '#ff5540', border: '1px solid rgba(255,85,64,0.15)', cursor: 'pointer' }}
                                            title="AI Analysis">
                                            <Microscope size={12} />
                                        </button>
                                        <button onClick={() => handleDiagnosisSuggest(report.filePath)}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(0, 0, 0, 0.45)', color: 'rgba(0, 0, 0, 0.90)', border: '1px solid rgba(0,0,0,0.09)', cursor: 'pointer' }}
                                            title="Diagnosis Suggestion">
                                            <FlaskConical size={12} />
                                        </button>
                                        <a href={`http://localhost:5000${report.filePath}`} target="_blank" rel="noreferrer"
                                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                                            style={{ background: '#f8f8f8', color: 'rgba(0, 0, 0, 0.90)', border: '1px solid rgba(0,0,0,0.08)' }}>
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center rounded-xl" style={{ background: '#f9f9f9', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <FileText size={32} style={{ color: 'rgba(0, 0, 0, 0.58)' }} />
                        </div>
                        <p className="font-mono-label uppercase tracking-[0.2em]" style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.70)', fontWeight: 600 }}>No Reports Archived</p>
                    </div>
                )}
            </Section>
        </div>
    );

    // ── Mind-Map panel ──────────────────────────────────────────────────────
    const HistoryPanel = () => (
        <Section
            title="Clinical Mind-Map"
            icon={<GitBranch size={16} />}
            action={deleteSelectedHistory.length > 0 ? (
                <button onClick={bulkDeleteHistory}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    <Trash2 size={12} /> Delete ({deleteSelectedHistory.length})
                </button>
            ) : null}
        >
            <div className="space-y-4">
                {diseaseGroups.length > 0 ? diseaseGroups.map((group, gi) => {
                    const expanded = expandedDisease === group.id;
                    return (
                        <motion.div key={group.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06 }}
                            className="rounded-2xl overflow-hidden"
                            style={{ border: expanded ? '1.5px solid rgba(255,85,64,0.2)' : '1px solid rgba(0,0,0,0.08)', background: expanded ? 'rgba(255,85,64,0.02)' : '#fff' }}>

                            {/* Disease header */}
                            <button
                                onClick={() => setExpandedDisease(expanded ? null : group.id)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left transition-all"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                                        style={{ background: expanded ? 'rgba(255,85,64,0.1)' : '#f8f8f8', border: expanded ? '1px solid rgba(255,85,64,0.2)' : '1px solid rgba(0,0,0,0.08)', color: expanded ? '#ff5540' : 'rgba(0, 0, 0, 0.75)' }}>
                                        <Activity size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-display font-bold" style={{ fontSize: '15px', color: expanded ? '#ff5540' : '#131313' }}>{group.disease}</p>
                                        <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)', marginTop: 3 }}>
                                            {new Date(group.createdAt).toLocaleDateString()} · {group.visits.length} visit{group.visits.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {group.visits.length >= 2 && (
                                        <button onClick={e => { e.stopPropagation(); runTreatmentTrend(group); }}
                                            disabled={analyzingTrend}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                                            style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(0,0,0,0.09)', color: 'rgba(0, 0, 0, 0.90)', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                            {analyzingTrend && trendDiseaseId === group.id ? <Activity size={10} className="animate-spin" /> : <TrendingUp size={10} />}
                                            {analyzingTrend && trendDiseaseId === group.id ? 'Analyzing…' : 'Trend'}
                                        </button>
                                    )}
                                    <ChevronDown size={16} style={{ color: 'rgba(0, 0, 0, 0.70)', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                                </div>
                            </button>

                            {/* Visits */}
                            <AnimatePresence>
                                {expanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                        <div className="px-6 py-5 space-y-4">
                                            {/* Compare button */}
                                            {selectedVisitsForComparison.length >= 2 && (
                                                <button onClick={e => { e.stopPropagation(); runVisitComparison(); }} disabled={comparingVisits}
                                                    className="v1-btn-primary pill-btn flex items-center gap-2 mb-2"
                                                    style={{ padding: '8px 18px', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                                                    {comparingVisits ? <><Activity size={12} className="animate-spin" /> Analyzing…</> : <><Microscope size={12} /> Compare Visits ({selectedVisitsForComparison.length})</>}
                                                </button>
                                            )}

                                            {/* Visit tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {group.visits.map(visit => {
                                                    const isSel = selectedVisitsForComparison.includes(visit.id);
                                                    const isExp = expandedVisit === visit.id;
                                                    const isWinner = visitComparisonResult?.betterTreatment?.toLowerCase().includes(visit.doctorName.toLowerCase());
                                                    return (
                                                        <div key={visit.id} className="relative flex items-center">
                                                            <button
                                                                onClick={() => setExpandedVisit(isExp ? null : visit.id)}
                                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl pr-9 transition-all"
                                                                style={{
                                                                    background: isExp ? '#f8f8f8' : isSel ? 'rgba(255,85,64,0.07)' : '#f8f8f8',
                                                                    border: isExp ? '1.5px solid rgba(0,0,0,0.12)' : isSel ? '1.5px solid rgba(255,85,64,0.25)' : '1px solid rgba(0,0,0,0.08)',
                                                                    cursor: 'pointer',
                                                                }}>
                                                                <Stethoscope size={12} style={{ color: isSel ? '#ff5540' : 'rgba(0, 0, 0, 0.75)' }} />
                                                                <div className="text-left">
                                                                    <p style={{ fontSize: '11px', fontWeight: 600, color: isSel ? '#ff5540' : '#131313', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.2 }}>
                                                                        Dr. {visit.doctorName}
                                                                        {isWinner && <Star size={9} fill="#f59e0b" style={{ color: '#f59e0b', display: 'inline', marginLeft: 4 }} />}
                                                                    </p>
                                                                    <p className="font-mono-label" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)', letterSpacing: '0.06em' }}>
                                                                        {new Date(visit.visitDate || visit.date).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                            <button onClick={e => toggleVisitSelection(e, visit.id)}
                                                                className="absolute right-2 w-5 h-5 rounded flex items-center justify-center transition-all"
                                                                style={{ background: isSel ? '#ff5540' : 'rgba(0,0,0,0.05)', color: isSel ? '#fff' : 'rgba(0, 0, 0, 0.70)', border: 'none', cursor: 'pointer' }}>
                                                                {isSel ? <CheckSquare size={10} /> : <Square size={10} />}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Expanded visit detail */}
                                            <AnimatePresence mode="wait">
                                                {expandedVisit && group.visits.find(v => v.id === expandedVisit) && (() => {
                                                    const rec = group.visits.find(v => v.id === expandedVisit);
                                                    return (
                                                        <motion.div key={expandedVisit} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                                            className="mt-2 pt-5 space-y-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                                            {/* Header row */}
                                                            <div className="flex items-center justify-between">
                                                                <span className="flex items-center gap-1.5 font-mono-label uppercase tracking-[0.08em]"
                                                                    style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.85)', background: '#f8f8f8', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.07)' }}>
                                                                    <MapPin size={9} /> {rec.hospitalName}
                                                                </span>
                                                                <button onClick={e => { e.stopPropagation(); toggleDeleteHistory(rec.id); }}
                                                                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                                                    style={{ background: deleteSelectedHistory.includes(rec.id) ? 'rgba(239,68,68,0.1)' : 'transparent', color: deleteSelectedHistory.includes(rec.id) ? '#ef4444' : 'rgba(0, 0, 0, 0.70)', border: '1px solid ' + (deleteSelectedHistory.includes(rec.id) ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.08)'), cursor: 'pointer' }}>
                                                                    {deleteSelectedHistory.includes(rec.id) ? <CheckSquare size={12} /> : <Trash2 size={12} />}
                                                                </button>
                                                            </div>

                                                            {/* Treatment note */}
                                                            <div className="px-5 py-4 rounded-2xl" style={surfaceCard}>
                                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-2" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Treatment Notes</p>
                                                                <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>
                                                                    "{rec.treatment}"
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                                                {/* Medicines */}
                                                                {rec.medicines?.length > 0 && (
                                                                    <div>
                                                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ fontSize: '9px', color: '#ff5540' }}>
                                                                            <Shield size={9} /> Pharmacotherapy
                                                                        </p>
                                                                        <div className="space-y-2">
                                                                            {rec.medicines.map((med, mi) => (
                                                                                <div key={mi} className="px-4 py-3 rounded-xl" style={surfaceCard}>
                                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{med.name}</span>
                                                                                        <span className="font-mono-label uppercase" style={{ fontSize: '9px', padding: '2px 7px', borderRadius: 6, background: 'rgba(255,85,64,0.07)', color: '#ff5540', border: '1px solid rgba(255,85,64,0.15)' }}>{med.dosage}</span>
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-1.5">
                                                                                        {med.duration && <span className="font-mono-label uppercase" style={{ fontSize: '8px', padding: '2px 6px', borderRadius: 5, background: '#f8f8f8', color: 'rgba(0, 0, 0, 0.90)', border: '1px solid rgba(0,0,0,0.07)' }}>{med.duration}</span>}
                                                                                        {med.timing?.map(t => (
                                                                                            <span key={t} className="font-mono-label uppercase flex items-center gap-1" style={{ fontSize: '8px', padding: '2px 6px', borderRadius: 5, background: '#f8f8f8', color: 'rgba(0, 0, 0, 0.90)', border: '1px solid rgba(0,0,0,0.07)' }}>
                                                                                                <Clock size={7} /> {t}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Attachments */}
                                                                {(rec.prescriptionAttachment || rec.reportName || rec.reportAttachment) && (
                                                                    <div>
                                                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.85)' }}>
                                                                            <FileUp size={9} /> Attachments
                                                                        </p>
                                                                        <div className="space-y-2">
                                                                            {rec.prescriptionAttachment && (
                                                                                <div className="relative group/analyze">
                                                                                    <a href={`http://localhost:5000${rec.prescriptionAttachment}`} target="_blank" rel="noreferrer"
                                                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all pr-12"
                                                                                        style={{ background: 'rgba(255,85,64,0.05)', border: '1px solid rgba(255,85,64,0.15)', textDecoration: 'none' }}>
                                                                                        <FileText size={14} style={{ color: '#ff5540', flexShrink: 0 }} />
                                                                                        <div>
                                                                                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>Digital Prescription</p>
                                                                                            <p className="font-mono-label uppercase" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>PDF Document</p>
                                                                                        </div>
                                                                                    </a>
                                                                                    <button onClick={e => { e.stopPropagation(); handleAnalyze(rec, 'prescription'); }}
                                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover/analyze:opacity-100 transition-all"
                                                                                        style={{ background: 'rgba(255,85,64,0.1)', color: '#ff5540', border: '1px solid rgba(255,85,64,0.2)', cursor: 'pointer' }}>
                                                                                        <Microscope size={12} />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                            {(rec.reportName || rec.reportAttachment) && (
                                                                                <div className="relative group/analyze">
                                                                                    {rec.reportAttachment ? (
                                                                                        <a href={`http://localhost:5000${rec.reportAttachment}`} target="_blank" rel="noreferrer"
                                                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl pr-12"
                                                                                            style={{ ...surfaceCard, textDecoration: 'none', display: 'flex' }}>
                                                                                            <Microscope size={14} style={{ color: 'rgba(0, 0, 0, 0.80)', flexShrink: 0 }} />
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="truncate" style={{ fontSize: '11px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{rec.reportName || 'Lab Report'}</p>
                                                                                                {rec.reportDate && <p className="font-mono-label uppercase" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Reported: {rec.reportDate}</p>}
                                                                                            </div>
                                                                                        </a>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={surfaceCard}>
                                                                                            <Microscope size={14} style={{ color: 'rgba(0, 0, 0, 0.80)', flexShrink: 0 }} />
                                                                                            <div>
                                                                                                <p style={{ fontSize: '11px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{rec.reportName || 'Lab Report'}</p>
                                                                                                {rec.reportDate && <p className="font-mono-label uppercase" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Reported: {rec.reportDate}</p>}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    <button onClick={e => { e.stopPropagation(); handleAnalyze(rec, 'report'); }}
                                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover/analyze:opacity-100 transition-all"
                                                                                        style={{ background: '#f8f8f8', color: 'rgba(0, 0, 0, 0.90)', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                                                                                        <Activity size={12} />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })()}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                }) : (
                    <div className="py-16 flex flex-col items-center justify-center rounded-xl" style={{ background: '#f9f9f9', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.12)' }}>
                            <Activity size={26} style={{ color: '#ff5540' }} />
                        </div>
                        <p className="font-display font-bold mb-1" style={{ fontSize: '18px', color: '#131313' }}>No diseases found</p>
                        <p className="font-mono-label uppercase tracking-[0.18em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.70)' }}>System Clear</p>
                    </div>
                )}
            </div>
        </Section>
    );

    // ── New Record panel ────────────────────────────────────────────────────
    const NewRecordPanel = ({ compact } = {}) => {
        const form = (
            <form onSubmit={handleHistorySubmit} className="space-y-6">
                {/* Disease */}
                <div>
                    <label style={labelSm}>Disease / Condition</label>
                    <select name="diseaseSelect" className={inputCls} style={inputSty}
                        onChange={e => {
                            const form = e.target.closest('form');
                            if (!form) return;
                            const el = form.querySelector('[name="newDiseaseName"]');
                            if (el) {
                                if (e.target.value === 'new') { el.style.display = 'block'; el.required = true; }
                                else { el.style.display = 'none'; el.required = false; }
                            }
                        }}>
                        <option value="new">+ New Disease</option>
                        {diseaseGroups.map(g => <option key={g.id} value={g.id}>{g.disease} ({new Date(g.createdAt).toLocaleDateString()})</option>)}
                    </select>
                    <input name="newDiseaseName" type="text" required
                        placeholder="Enter new disease name…"
                        className={`${inputCls} mt-2`} style={{ ...inputSty, display: 'block' }} />
                </div>

                {/* Visit date */}
                <div>
                    <label style={labelSm}>Consultation Date</label>
                    <input required name="visitDate" type="date" defaultValue={new Date().toISOString().split('T')[0]}
                        className={inputCls} style={inputSty} />
                </div>

                {/* Treatment notes */}
                <div>
                    <label style={labelSm}>Clinical Notes & Treatment</label>
                    <textarea required name="treatment" rows={4} placeholder="Treatment notes…"
                        className={inputCls} style={{ ...inputSty, minHeight: 120, borderRadius: '16px' }} />
                </div>

                {/* Tests */}
                <div className="rounded-2xl p-5 space-y-3" style={surfaceCard}>
                    <div className="flex items-center justify-between">
                        <p style={labelSm}>Required Tests</p>
                        <button type="button" onClick={addTest}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#ff5540', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
                            + Add Test
                        </button>
                    </div>
                    {prescribedTests.map((test, i) => (
                        <div key={i} className="relative flex items-center gap-2">
                            <input type="text" value={test} onChange={e => updateTest(i, e.target.value)}
                                placeholder="Test name…" className={`${inputCls} flex-1`} style={inputSty} />
                            <button type="button" onClick={() => removeTest(i)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label style={labelSm}>Hospital</label>
                        <input required name="hospitalName" type="text" placeholder="Hospital name" className={inputCls} style={inputSty} />
                    </div>
                    <div>
                        <label style={labelSm}>Doctor</label>
                        <input required name="doctorName" type="text"
                            defaultValue={user?.role === 'doctor' ? user.name : ''}
                            placeholder="Doctor name" className={inputCls} style={inputSty} />
                    </div>
                </div>

                {/* Feature 5: Prescription Parser */}
                <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(0, 0, 0, 0.02)', border: '1.5px dashed rgba(0,0,0,0.12)' }}>
                    <div className="flex items-center gap-2 mb-1">
                        <ScanLine size={13} style={{ color: '#000000' }} />
                        <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '10px', color: '#000000' }}>AI Prescription Scanner</p>
                        <span className="font-mono-label uppercase px-2 py-0.5 rounded-lg" style={{ fontSize: '8px', background: 'rgba(0, 0, 0, 0.06)', color: 'rgba(0, 0, 0, 0.80)' }}>Gemini Vision</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        Upload a photo or scan of a prescription — AI will read it and auto-fill the medicines below.
                    </p>
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: parsingPrescription ? 'rgba(0, 0, 0, 0.04)' : '#fff', border: '1px solid rgba(0,0,0,0.1)' }}
                        onMouseEnter={e => { if (!parsingPrescription) e.currentTarget.style.borderColor = '#000000'; }}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}>
                        {parsingPrescription
                            ? <><Activity size={14} className="animate-spin" style={{ color: '#000000' }} /><span style={{ fontSize: '12px', color: '#000000', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>Parsing prescription…</span></>
                            : <><ScanLine size={14} style={{ color: 'rgba(0, 0, 0, 0.90)' }} /><span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>Upload prescription image or PDF</span></>
                        }
                        <input type="file" accept="image/*,.pdf" className="hidden" disabled={parsingPrescription}
                            onChange={e => parsePrescription(e.target.files[0])} />
                    </label>
                    {parsedPrescription && (
                        <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <p className="font-mono-label uppercase tracking-[0.08em] flex items-center gap-1.5" style={{ fontSize: '9px', color: '#22c55e', marginBottom: 6 }}>
                                <CheckCircle2 size={10} /> Prescription Parsed — {parsedPrescription.medicines?.length || 0} medicines loaded
                            </p>
                            {parsedPrescription.diagnosis && <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>Diagnosis: <strong>{parsedPrescription.diagnosis}</strong></p>}
                            {parsedPrescription.notes && <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic', marginTop: 3 }}>{parsedPrescription.notes}</p>}
                        </div>
                    )}
                </div>

                {/* Medicines */}
                <div className="rounded-2xl p-5 space-y-4" style={surfaceCard}>
                    <div className="flex items-center justify-between">
                        <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '10px', color: '#ff5540' }}>Medications</p>
                        <div className="flex items-center gap-2">
                            {medicines.filter(m => m.name.trim()).length >= 2 && (
                                <button type="button" onClick={handleCheckInteractions} disabled={checkingInteractions}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(0, 0, 0, 0.46)', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(0, 0, 0, 0.95)', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                    {checkingInteractions ? <><Activity size={10} className="animate-spin" /> Checking…</> : <><Pill size={10} /> Check Interactions</>}
                                </button>
                            )}
                            <button type="button" onClick={addMedicine}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#ff5540', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
                                + Add Drug
                            </button>
                        </div>
                    </div>
                    {medicines.map((med, i) => (
                        <div key={i} className="rounded-2xl p-4 space-y-3 relative" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                            <button type="button" onClick={() => removeMedicine(i)}
                                style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                <X size={13} />
                            </button>
                            <input type="text" placeholder="Medication name" value={med.name}
                                onChange={e => updateMedicine(i, 'name', e.target.value)}
                                className={inputCls} style={inputSty} />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Dosage (1-0-1)" value={med.dosage}
                                    onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                                    className={inputCls} style={inputSty} />
                                <input type="text" placeholder="Duration (days)" value={med.duration}
                                    onChange={e => updateMedicine(i, 'duration', e.target.value)}
                                    className={inputCls} style={inputSty} />
                            </div>
                            <div className="flex gap-2">
                                {['Morning', 'Afternoon', 'Evening', 'Night'].map(t => (
                                    <button key={t} type="button" onClick={() => toggleTiming(i, t.toUpperCase())}
                                        className="flex-1 py-2 rounded-xl font-mono-label uppercase tracking-[0.06em] transition-all"
                                        style={{
                                            fontSize: '8px', cursor: 'pointer', border: 'none',
                                            background: med.timing?.includes(t.toUpperCase()) ? '#ff5540' : '#f8f8f8',
                                            color: med.timing?.includes(t.toUpperCase()) ? '#fff' : 'rgba(0, 0, 0, 0.80)',
                                        }}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Prescription upload */}
                <div className="rounded-2xl p-5 space-y-4" style={surfaceCard}>
                    <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '10px', color: '#ff5540' }}>Upload Prescription (Optional)</p>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                            style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.2)', color: '#ff5540', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            <FileUp size={13} /> Attach PDF
                            <input type="file" accept=".pdf" name="prescriptionFile" className="hidden"
                                onChange={e => { document.getElementById('rxFileName').innerText = e.target.files[0]?.name || 'No file chosen'; }} />
                        </label>
                        <span id="rxFileName" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)', fontFamily: "'Hanken Grotesk', sans-serif" }}>No file chosen</span>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '16px' }}>
                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.85)' }}>Upload Test Report (Optional)</p>
                        <div className="space-y-3">
                            <input name="reportName" type="text" placeholder="Report name (e.g. Blood Test)" className={inputCls} style={inputSty} />
                            <input name="reportDate" type="date" className={inputCls} style={inputSty} />
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(0, 0, 0, 0.90)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    <FileUp size={13} /> Attach PDF
                                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" name="testReportFile" className="hidden"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            document.getElementById('reportFileName').innerText = file?.name || 'No file chosen';
                                            const ri = e.target.form.reportName;
                                            if (ri && !ri.value && file) ri.value = file.name.replace(/\.[^.]+$/, '');
                                            const req = !!file;
                                            e.target.form.reportName.required = req;
                                            e.target.form.reportDate.required = req;
                                        }} />
                                </label>
                                <span id="reportFileName" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)', fontFamily: "'Hanken Grotesk', sans-serif" }}>No file chosen</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit"
                    className="v1-btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2"
                    style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                    Commit to Vault <ChevronRight size={14} />
                </button>
            </form>
        );
        if (compact) return form;
        return <Section title="New Clinical Record" icon={<PlusCircle size={16} />}>{form}</Section>;
    };

    const handleSignOut = () => { logout(); navigate('/login'); };

    const mainPanels = { overview: OverviewPanel(), reports: ReportsPanel(), history: HistoryPanel(), new: NewRecordPanel() };

    return (
        <div className="flex min-h-screen" style={{ paddingTop: '64px', background: '#fafafa' }}>
            <Sidebar
                active={activeSection} setActive={setActiveSection} patient={patient}
                mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen}
                onSignOut={handleSignOut} isMobile={false}
            />

            {/* Main content */}
            <div className="flex-1 min-w-0">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-3 px-6 py-4 sticky top-16 z-40"
                    style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <button onClick={() => setMobileSidebarOpen(true)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', color: '#131313' }}>
                        <Menu size={16} />
                    </button>
                    <p className="font-display font-bold" style={{ fontSize: '16px', color: '#131313' }}>
                        {NAV.find(n => n.id === activeSection)?.label}
                    </p>
                </div>

                <main className="px-6 md:px-10 py-10">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                            {mainPanels[activeSection]}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Persistent right panel — New Record (desktop only) */}
            <aside
                className="hidden lg:flex flex-col w-[360px] shrink-0 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto"
                style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.02)' }}
            >
                <div className="px-6 py-5 bg-white" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <h2 className="font-mono-label uppercase tracking-[0.18em] flex items-center gap-2.5"
                        style={{ fontSize: '11px', color: '#131313', fontWeight: 600 }}>
                        <span style={{ color: '#ff5540' }}><PlusCircle size={14} /></span>
                        New Record
                    </h2>
                </div>
                <div className="px-6 py-6 flex-1">
                    {NewRecordPanel({ compact: true })}
                </div>
            </aside>

            {/* ── Comparison Modal ──────────────────────────────────────────── */}
            <AnimatePresence>
                {comparisonResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                        <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
                            className="w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[88vh]" style={card}>
                            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.15)', color: '#ff5540' }}>
                                        <Activity size={16} />
                                    </div>
                                    <h3 className="font-display font-bold" style={{ fontSize: '18px', color: '#131313' }}>AI Diagnostic Analysis</h3>
                                </div>
                                <button onClick={() => { setComparisonResult(null); setSelectedReports([]); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.80)' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto space-y-6 flex-1">
                                <div className="px-6 py-5 rounded-2xl" style={{ background: 'rgba(255,85,64,0.04)', borderLeft: '4px solid #ff5540', border: '1px solid rgba(255,85,64,0.15)' }}>
                                    <p className="font-mono-label uppercase tracking-[0.1em] mb-2" style={{ fontSize: '9px', color: '#ff5540' }}>Executive Summary</p>
                                    <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif" }}>{comparisonResult.summary}</p>
                                </div>
                                <div className="space-y-3">
                                    <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Metrics Comparison</p>
                                    {comparisonResult.comparisons?.map((comp, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl" style={surfaceCard}>
                                            <div className="flex-1 min-w-0">
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{comp.metric}</p>
                                                {comp.notes && <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic', marginTop: 2 }}>{comp.notes}</p>}
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-center px-3">
                                                    <p className="font-mono-label uppercase" style={{ fontSize: '8px', color: 'rgba(0, 0, 0, 0.80)' }}>Before</p>
                                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{comp.oldValue}</p>
                                                </div>
                                                <ChevronRight size={14} style={{ color: 'rgba(0, 0, 0, 0.60)' }} />
                                                <div className="text-center px-3">
                                                    <p className="font-mono-label uppercase" style={{ fontSize: '8px', color: 'rgba(0, 0, 0, 0.80)' }}>After</p>
                                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{comp.newValue}</p>
                                                </div>
                                                <span className="font-mono-label uppercase tracking-[0.08em] px-3 py-1.5 rounded-xl"
                                                    style={{
                                                        fontSize: '9px',
                                                        background: comp.status?.toLowerCase().includes('improve') ? 'rgba(34,197,94,0.08)' : comp.status?.toLowerCase().includes('worsen') ? 'rgba(239,68,68,0.08)' : '#f8f8f8',
                                                        color: comp.status?.toLowerCase().includes('improve') ? '#22c55e' : comp.status?.toLowerCase().includes('worsen') ? '#ef4444' : 'rgba(0, 0, 0, 0.90)',
                                                        border: '1px solid ' + (comp.status?.toLowerCase().includes('improve') ? 'rgba(34,197,94,0.2)' : comp.status?.toLowerCase().includes('worsen') ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.08)'),
                                                    }}>
                                                    {comp.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {comparisonResult.recommendations?.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Clinical Recommendations</p>
                                        {comparisonResult.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-start gap-3 px-5 py-4 rounded-2xl" style={surfaceCard}>
                                                <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: '#ff5540' }} />
                                                <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.6, fontFamily: "'Hanken Grotesk', sans-serif" }}>{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── AI Analysis Modal ─────────────────────────────────────────── */}
            <AnimatePresence>
                {showAnalysisModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="absolute inset-0" onClick={() => !analyzing && setShowAnalysisModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden" style={card}>
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.18)', color: '#ff5540' }}>
                                        <Microscope size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold" style={{ fontSize: '19px', color: '#131313' }}>AI Health Diagnostics</h2>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="font-mono-label uppercase tracking-[0.08em] px-2 py-0.5 rounded-lg" style={{ fontSize: '9px', background: 'rgba(255,85,64,0.07)', color: '#ff5540', border: '1px solid rgba(255,85,64,0.18)' }}>Gemini 2.5 Flash</span>
                                            <span className="font-mono-label uppercase" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.75)', letterSpacing: '0.08em' }}>Clinical Report Analysis</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowAnalysisModal(false)}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.90)' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8 overflow-y-auto flex-1">
                                {analyzing ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-[#ff5540]/20 border-t-[#ff5540] rounded-full animate-spin" />
                                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}>Analyzing report…</p>
                                    </div>
                                ) : analysisResult ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-2">
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: '#ff5540' }}>Clinical Summary</p>
                                                <p style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.75, fontFamily: "'Hanken Grotesk', sans-serif" }}>{analysisResult.overallSummary}</p>
                                            </div>
                                            <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ fontSize: '9px', color: '#ef4444' }}>
                                                    <AlertCircle size={10} /> Critical Findings
                                                </p>
                                                <ul className="space-y-2">
                                                    {analysisResult.warnings?.length === 0
                                                        ? <li style={{ fontSize: '12px', color: '#22c55e', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>No urgent findings.</li>
                                                        : analysisResult.warnings?.map((w, i) => (
                                                            <li key={i} className="flex items-start gap-2" style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                                                <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span> {w}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Values table */}
                                        <div>
                                            <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Metric Extraction</p>
                                            <div className="rounded-2xl overflow-hidden" style={surfaceCard}>
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                                            {['Metric', 'Value', 'Normal Range', 'Status', 'Note'].map(h => (
                                                                <th key={h} className="px-4 py-3 font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {analysisResult.values?.map((v, i) => (
                                                            <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                                <td className="px-4 py-3" style={{ fontSize: '12px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{v.metric}</td>
                                                                <td className="px-4 py-3" style={{ fontSize: '12px', fontWeight: 700, color: '#ff5540', fontFamily: "'JetBrains Mono', monospace" }}>{v.patientValue}</td>
                                                                <td className="px-4 py-3" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif" }}>{v.normalRange}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className="font-mono-label uppercase px-2 py-1 rounded-lg" style={{
                                                                        fontSize: '8px',
                                                                        background: v.status === 'normal' ? 'rgba(34,197,94,0.08)' : v.status === 'low' ? 'rgba(234,179,8,0.08)' : v.status === 'high' ? 'rgba(249,115,22,0.08)' : 'rgba(239,68,68,0.08)',
                                                                        color: v.status === 'normal' ? '#22c55e' : v.status === 'low' ? '#eab308' : v.status === 'high' ? '#f97316' : '#ef4444',
                                                                        border: '1px solid ' + (v.status === 'normal' ? 'rgba(34,197,94,0.2)' : v.status === 'low' ? 'rgba(234,179,8,0.2)' : v.status === 'high' ? 'rgba(249,115,22,0.2)' : 'rgba(239,68,68,0.2)'),
                                                                    }}>{v.status}</span>
                                                                </td>
                                                                <td className="px-4 py-3" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{v.note}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: '#ff5540' }}>Specialist Referrals</p>
                                                <div className="space-y-3">
                                                    {analysisResult.recommendedDoctors?.map((doc, i) => (
                                                        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-2xl" style={surfaceCard}>
                                                            <Stethoscope size={14} style={{ color: '#ff5540', flexShrink: 0, marginTop: 2 }} />
                                                            <div>
                                                                <p style={{ fontSize: '12px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{doc.speciality}</p>
                                                                <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif" }}>{doc.reason}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {includeFoodAdvice && (
                                                <div>
                                                    <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.85)' }}>Dietary Recommendations</p>
                                                    <div className="space-y-3">
                                                        {analysisResult.foodRecommendations?.map((food, i) => (
                                                            <div key={i} className="px-4 py-3 rounded-2xl" style={surfaceCard}>
                                                                <p className="font-mono-label uppercase tracking-[0.08em] mb-2" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.90)' }}>{food.forMetric}</p>
                                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                                    {food.foods.map((f, fi) => (
                                                                        <span key={fi} style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.95)', background: '#fff', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', fontFamily: "'Hanken Grotesk', sans-serif" }}>#{f}</span>
                                                                    ))}
                                                                </div>
                                                                <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{food.advice}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <Microscope size={36} style={{ color: 'rgba(0, 0, 0, 0.60)', margin: '0 auto 12px' }} />
                                        <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.75)', fontFamily: "'Hanken Grotesk', sans-serif" }}>Analysis offline.</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-8 py-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} style={{ color: '#ff5540' }} />
                                    <span className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.75)' }}>HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={includeFoodAdvice} onChange={() => setIncludeFoodAdvice(!includeFoodAdvice)} className="accent-[#ff5540]" />
                                        <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif" }}>Include Food Tips</span>
                                    </label>
                                    <button onClick={() => setShowAnalysisModal(false)}
                                        className="v1-btn-primary pill-btn px-6 py-2.5"
                                        style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Visit Comparison Modal ────────────────────────────────────── */}
            <AnimatePresence>
                {showVisitComparisonModal && visitComparisonResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="absolute inset-0" onClick={() => setShowVisitComparisonModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden" style={card}>
                            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', color: '#131313' }}>
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold" style={{ fontSize: '19px', color: '#131313' }}>Treatment Comparison</h2>
                                        <span className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.75)' }}>Pharmacotherapy & Lab Reports</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowVisitComparisonModal(false)}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.90)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto flex-1 space-y-6">
                                {visitComparisonResult.betterTreatment && (
                                    <div className="flex items-start gap-4 px-6 py-5 rounded-2xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1.5px solid rgba(245,158,11,0.2)' }}>
                                        <Star size={18} fill="#f59e0b" style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                                        <div>
                                            <p className="font-mono-label uppercase tracking-[0.1em] mb-1" style={{ fontSize: '9px', color: '#f59e0b' }}>Recommended Approach</p>
                                            <p className="font-display font-bold" style={{ fontSize: '16px', color: '#131313' }}>Dr. {visitComparisonResult.betterTreatment}</p>
                                            <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.6, fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic', marginTop: 6 }}>{visitComparisonResult.reasoning}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="px-5 py-4 rounded-2xl" style={surfaceCard}>
                                    <p className="font-mono-label uppercase tracking-[0.1em] mb-2" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Overview</p>
                                    <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif" }}>{visitComparisonResult.summary}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Prescription Changes</p>
                                        <div className="space-y-2">
                                            {visitComparisonResult.prescriptionChanges?.length > 0
                                                ? visitComparisonResult.prescriptionChanges.map((pc, i) => (
                                                    <div key={i} className="px-4 py-3 rounded-xl" style={surfaceCard}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{pc.medicine}</p>
                                                            <span className="font-mono-label uppercase px-2 py-0.5 rounded-lg" style={{
                                                                fontSize: '8px',
                                                                background: pc.change.toLowerCase().includes('add') ? 'rgba(34,197,94,0.08)' : pc.change.toLowerCase().includes('remov') ? 'rgba(239,68,68,0.08)' : '#f8f8f8',
                                                                color: pc.change.toLowerCase().includes('add') ? '#22c55e' : pc.change.toLowerCase().includes('remov') ? '#ef4444' : 'rgba(0, 0, 0, 0.90)',
                                                            }}>{pc.change}</span>
                                                        </div>
                                                        <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{pc.reasoning}</p>
                                                    </div>
                                                ))
                                                : <p style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.75)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>No prescription changes.</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Metric Trends</p>
                                        <div className="space-y-2">
                                            {visitComparisonResult.reportChanges?.length > 0
                                                ? visitComparisonResult.reportChanges.map((rc, i) => (
                                                    <div key={i} className="px-4 py-3 rounded-xl" style={surfaceCard}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{rc.metric}</p>
                                                            <span className="font-mono-label uppercase px-2 py-0.5 rounded-lg" style={{
                                                                fontSize: '8px',
                                                                background: rc.trend === 'improved' ? 'rgba(34,197,94,0.08)' : rc.trend === 'worsened' ? 'rgba(239,68,68,0.08)' : '#f8f8f8',
                                                                color: rc.trend === 'improved' ? '#22c55e' : rc.trend === 'worsened' ? '#ef4444' : 'rgba(0, 0, 0, 0.90)',
                                                            }}>{rc.trend}</span>
                                                        </div>
                                                        {rc.notes && <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.85)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{rc.notes}</p>}
                                                    </div>
                                                ))
                                                : <p style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.75)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>No lab data available.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Medicine Interaction Modal (Feature 2) ────────────────────── */}
            <AnimatePresence>
                {showInteractionModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="absolute inset-0" onClick={() => !checkingInteractions && setShowInteractionModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden" style={card}>
                            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.46)', border: '1px solid rgba(0,0,0,0.1)', color: '#131313' }}>
                                        <Pill size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold" style={{ fontSize: '18px', color: '#131313' }}>Medicine Interactions</h2>
                                        <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.75)' }}>Gemini 2.5 Flash · Clinical Pharmacology</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowInteractionModal(false)} className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.90)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto flex-1">
                                {checkingInteractions ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-[#131313]/20 border-t-[#131313] rounded-full animate-spin" />
                                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}>Checking interactions…</p>
                                    </div>
                                ) : interactionResult ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                                            style={{ background: interactionResult.safe ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${interactionResult.safe ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                            {interactionResult.safe
                                                ? <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                                : <TriangleAlert size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
                                            <p style={{ fontSize: '14px', color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, lineHeight: 1.5 }}>{interactionResult.summary}</p>
                                        </div>
                                        {interactionResult.interactions?.length > 0 ? (
                                            <div className="space-y-4">
                                                <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Interactions Found</p>
                                                {interactionResult.interactions.map((ix, i) => {
                                                    const sevColor = ix.severity === 'contraindicated' ? '#ef4444' : ix.severity === 'severe' ? '#f97316' : ix.severity === 'moderate' ? '#eab308' : '#22c55e';
                                                    const sevBg = ix.severity === 'contraindicated' ? 'rgba(239,68,68,0.07)' : ix.severity === 'severe' ? 'rgba(249,115,22,0.07)' : ix.severity === 'moderate' ? 'rgba(234,179,8,0.07)' : 'rgba(34,197,94,0.07)';
                                                    return (
                                                        <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background: sevBg, border: `1px solid ${sevColor}30` }}>
                                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                                                    {ix.drug1} <span style={{ color: 'rgba(0, 0, 0, 0.70)', fontWeight: 400 }}>×</span> {ix.drug2}
                                                                </p>
                                                                <span className="font-mono-label uppercase px-3 py-1 rounded-xl" style={{ fontSize: '9px', background: sevBg, color: sevColor, border: `1px solid ${sevColor}40` }}>{ix.severity}</span>
                                                            </div>
                                                            <p style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6 }}>{ix.effect}</p>
                                                            {ix.recommendation && (
                                                                <div className="flex items-start gap-2 pt-1" style={{ borderTop: `1px solid ${sevColor}20` }}>
                                                                    <Info size={12} style={{ color: sevColor, flexShrink: 0, marginTop: 2 }} />
                                                                    <p style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{ix.recommendation}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="py-10 text-center rounded-2xl" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
                                                <CheckCircle2 size={32} style={{ color: '#22c55e', margin: '0 auto 10px' }} />
                                                <p style={{ fontSize: '13px', color: '#22c55e', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600 }}>No interactions detected between the listed medicines.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex justify-end px-8 py-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                <button onClick={() => setShowInteractionModal(false)} className="v1-btn-primary pill-btn px-6 py-2.5"
                                    style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Diagnosis Suggestion Modal (Feature 3) ────────────────────── */}
            <AnimatePresence>
                {showDiagnosisModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="absolute inset-0" onClick={() => !gettingDiagnosis && setShowDiagnosisModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden" style={card}>
                            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,85,64,0.07)', border: '1px solid rgba(255,85,64,0.18)', color: '#ff5540' }}>
                                        <FlaskConical size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold" style={{ fontSize: '18px', color: '#131313' }}>Diagnosis Suggestion</h2>
                                        <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.75)' }}>Gemini 2.5 Flash · Diagnostic Reasoning</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDiagnosisModal(false)} className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.90)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto flex-1">
                                {gettingDiagnosis ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-[#ff5540]/20 border-t-[#ff5540] rounded-full animate-spin" />
                                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}>Reading report…</p>
                                    </div>
                                ) : diagnosisResult ? (
                                    <div className="space-y-6">
                                        {/* Top diagnosis hero */}
                                        <div className="px-6 py-5 rounded-2xl" style={{ background: 'rgba(255,85,64,0.04)', border: '1px solid rgba(255,85,64,0.18)' }}>
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '9px', color: '#ff5540' }}>Top Diagnosis</p>
                                                <span className="font-mono-label uppercase px-3 py-1 rounded-xl"
                                                    style={{ fontSize: '9px', background: diagnosisResult.urgency === 'urgent' ? 'rgba(239,68,68,0.1)' : diagnosisResult.urgency === 'soon' ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.08)', color: diagnosisResult.urgency === 'urgent' ? '#ef4444' : diagnosisResult.urgency === 'soon' ? '#f97316' : '#22c55e', border: '1px solid currentColor' }}>
                                                    {diagnosisResult.urgency}
                                                </span>
                                            </div>
                                            <p className="font-display font-bold" style={{ fontSize: '20px', color: '#131313', marginBottom: 8 }}>{diagnosisResult.topDiagnosis}</p>
                                            <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.7, fontFamily: "'Hanken Grotesk', sans-serif" }}>{diagnosisResult.explanation}</p>
                                            {diagnosisResult.urgencyNote && (
                                                <p className="flex items-center gap-1.5 mt-3" style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.90)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>
                                                    <Info size={12} /> {diagnosisResult.urgencyNote}
                                                </p>
                                            )}
                                        </div>
                                        {/* Conditions list */}
                                        {diagnosisResult.conditions?.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="font-mono-label uppercase tracking-[0.1em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Differential Diagnoses</p>
                                                {diagnosisResult.conditions.map((cond, i) => (
                                                    <div key={i} className="rounded-2xl p-5 space-y-3" style={surfaceCard}>
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif" }}>{cond.name}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono-label uppercase px-2 py-0.5 rounded-lg"
                                                                    style={{ fontSize: '8px', background: cond.confidence === 'likely' ? 'rgba(255,85,64,0.08)' : cond.confidence === 'possible' ? 'rgba(249,115,22,0.08)' : '#f8f8f8', color: cond.confidence === 'likely' ? '#ff5540' : cond.confidence === 'possible' ? '#f97316' : 'rgba(0, 0, 0, 0.85)' }}>
                                                                    {cond.confidence}
                                                                </span>
                                                                {cond.specialist && <span className="font-mono-label uppercase px-2 py-0.5 rounded-lg" style={{ fontSize: '8px', background: '#f8f8f8', color: 'rgba(0, 0, 0, 0.90)', border: '1px solid rgba(0,0,0,0.07)' }}>See: {cond.specialist}</span>}
                                                            </div>
                                                        </div>
                                                        {cond.indicatingValues?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {cond.indicatingValues.map((v, vi) => (
                                                                    <span key={vi} style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.95)', background: '#fff', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-between px-8 py-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={12} style={{ color: 'rgba(0, 0, 0, 0.75)' }} />
                                    <span className="font-mono-label uppercase" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.70)', letterSpacing: '0.08em' }}>Not a substitute for professional medical advice</span>
                                </div>
                                <button onClick={() => setShowDiagnosisModal(false)} className="v1-btn-primary pill-btn px-6 py-2.5"
                                    style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Treatment Trend Modal (Feature 4) ────────────────────────── */}
            <AnimatePresence>
                {showTrendModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                        <div className="absolute inset-0" onClick={() => !analyzingTrend && setShowTrendModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden" style={card}>
                            <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', color: '#131313' }}>
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold" style={{ fontSize: '18px', color: '#131313' }}>Treatment Trend Analysis</h2>
                                        <p className="font-mono-label uppercase tracking-[0.08em]" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.75)' }}>
                                            {trendDiseaseId ? (diseaseGroups.find(g => g.id === trendDiseaseId)?.disease || 'Condition') : 'Condition'} · Visit Timeline
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setShowTrendModal(false)} className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.90)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto flex-1">
                                {analyzingTrend ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-[#131313]/20 border-t-[#131313] rounded-full animate-spin" />
                                        <p className="font-mono-label uppercase tracking-[0.12em]" style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.80)' }}>Analyzing treatment timeline…</p>
                                    </div>
                                ) : trendResult ? (
                                    <div className="space-y-6">
                                        {/* Trend banner */}
                                        <div className="flex items-center gap-4 px-6 py-5 rounded-2xl" style={{
                                            background: trendResult.trend === 'improving' ? 'rgba(34,197,94,0.05)' : trendResult.trend === 'worsening' ? 'rgba(239,68,68,0.05)' : 'rgba(0, 0, 0, 0.43)',
                                            border: `1px solid ${trendResult.trend === 'improving' ? 'rgba(34,197,94,0.2)' : trendResult.trend === 'worsening' ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.1)'}`,
                                        }}>
                                            <TrendingUp size={22} style={{ color: trendResult.trend === 'improving' ? '#22c55e' : trendResult.trend === 'worsening' ? '#ef4444' : '#131313', flexShrink: 0 }} />
                                            <div>
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-1" style={{ fontSize: '9px', color: trendResult.trend === 'improving' ? '#22c55e' : trendResult.trend === 'worsening' ? '#ef4444' : 'rgba(0, 0, 0, 0.80)' }}>Overall Trend: {trendResult.trend}</p>
                                                <p style={{ fontSize: '14px', color: '#131313', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>{trendResult.trendNote}</p>
                                            </div>
                                        </div>
                                        <div className="px-5 py-4 rounded-2xl" style={surfaceCard}>
                                            <p className="font-mono-label uppercase tracking-[0.1em] mb-2" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Analysis</p>
                                            <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', lineHeight: 1.75, fontFamily: "'Hanken Grotesk', sans-serif" }}>{trendResult.paragraph}</p>
                                        </div>
                                        {trendResult.milestones?.length > 0 && (
                                            <div>
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-3" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.80)' }}>Visit Milestones</p>
                                                <div className="space-y-2">
                                                    {trendResult.milestones.map((m, i) => (
                                                        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={surfaceCard}>
                                                            <span className="font-mono-label font-bold shrink-0" style={{ fontSize: '11px', color: '#ff5540', minWidth: 20 }}>#{m.visit}</span>
                                                            <p style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>{m.note}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {trendResult.medicineEvolution && (
                                            <div className="px-5 py-4 rounded-2xl" style={{ background: 'rgba(255,85,64,0.03)', border: '1px solid rgba(255,85,64,0.12)' }}>
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5" style={{ fontSize: '9px', color: '#ff5540' }}><Pill size={9} /> Medicine Evolution</p>
                                                <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif", fontStyle: 'italic' }}>{trendResult.medicineEvolution}</p>
                                            </div>
                                        )}
                                        {trendResult.recommendation && (
                                            <div className="px-5 py-4 rounded-2xl" style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.07)' }}>
                                                <p className="font-mono-label uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5" style={{ fontSize: '9px', color: 'rgba(0, 0, 0, 0.90)' }}><Zap size={9} /> AI Recommendation</p>
                                                <p style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.95)', fontFamily: "'Hanken Grotesk', sans-serif" }}>{trendResult.recommendation}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex justify-end px-8 py-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                                <button onClick={() => setShowTrendModal(false)} className="v1-btn-primary pill-btn px-6 py-2.5"
                                    style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PatientProfile;
