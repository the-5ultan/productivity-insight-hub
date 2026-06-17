import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  PieChart, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Database, label: 'Datasets', path: '/dashboard/datasets' },
    { icon: BarChart3, label: 'Analysis', path: '/dashboard/analysis' },
    { icon: PieChart, label: 'Visualizations', path: '/dashboard/visuals' },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-72 bg-black border-r border-white/5 h-[calc(100vh-6rem)] sticky top-24 flex flex-col px-6">
      <nav className="flex-1 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path}
              className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-white/20'} />
              <span className="text-[13px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="py-4 px-2 mb-4">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-4 px-5 py-4 w-full rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut size={20} />
          <span className="text-[13px] font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>

      <div className="py-8 border-t border-white/5">
        <div className="glass-card bg-white/[0.02] border-white/5 p-6 rounded-3xl">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3">Support</div>
          <p className="text-[11px] text-white/40 leading-relaxed">Need help with your research? Contact our data team.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
