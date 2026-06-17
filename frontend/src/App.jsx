import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Datasets from './pages/Datasets';
import Analysis from './pages/Analysis';
import Visualizations from './pages/Visualizations';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';

import { AuthProvider, useAuth } from './context/AuthContext';
import SettingsPage from './pages/Settings';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // Store temporary token for the profile fetch
      localStorage.setItem('token', accessToken);
      
      // Fetch user profile to store in AuthContext and localStorage
      fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userData = {
            name: data.data.User.name,
            email: data.data.User.email,
            avatar_url: data.data.User.avatar_url
          };
          login(userData, accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('accessToken', accessToken);
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'));
    } else {
      navigate('/');
    }
  }, [navigate, location, login]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-serif">
      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-6">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </div>
      <h2 className="text-2xl font-light tracking-widest uppercase opacity-80">Authenticating</h2>
      <p className="text-white/40 mt-4 font-light italic">Please wait while we secure your session...</p>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<div className="pt-32 text-center text-primary-accent">Login Page (Coming Soon)</div>} />
        <Route path="/register" element={<div className="pt-32 text-center text-primary-accent">Register Page (Coming Soon)</div>} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="visuals" element={<Visualizations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Direct Access Routes (Alternative to Sidebar) */}
        <Route path="/analysis" element={<div className="pt-32 px-10"><Analysis /></div>} />
        <Route path="/datasets" element={<div className="pt-32 px-10"><Datasets /></div>} />
        <Route path="/settings" element={<div className="pt-32 px-10"><SettingsPage /></div>} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
