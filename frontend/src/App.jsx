import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientProfile from './pages/PatientProfile';
import DoctorRatings from './pages/DoctorRatings';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import Mission from './pages/Mission';
import Support from './pages/Support';
import Features from './pages/Features';

// Smooth Transition Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.99 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.01 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path="/mission" element={<PageTransition><Mission /></PageTransition>} />
        <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
        <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
        <Route path="/patient/:cnic" element={
          <ProtectedRoute>
            <PageTransition><PatientProfile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/ratings" element={
          <PageTransition><DoctorRatings /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 relative">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
