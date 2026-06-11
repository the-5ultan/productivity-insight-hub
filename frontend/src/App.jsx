import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Datasets from './pages/Datasets';
import Analysis from './pages/Analysis';
import Visualizations from './pages/Visualizations';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/login" element={<><Navbar /><div className="pt-32 text-center text-primary-accent">Login Page (Coming Soon)</div></>} />
        <Route path="/register" element={<><Navbar /><div className="pt-32 text-center text-primary-accent">Register Page (Coming Soon)</div></>} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="visuals" element={<Visualizations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="settings" element={<div className="text-primary-accent">Settings Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
