import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  PieChart, 
  FileText, 
  Settings,
  LogOut,
  X
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
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

  const sidebarContent = (
    <div className="flex flex-col h-full px-4 md:px-6">
      <nav className="flex-1 space-y-1 md:space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path}
              onClick={onMobileClose}
              className={`flex items-center space-x-4 px-4 md:px-5 py-3 md:py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white flex-shrink-0' : 'text-white/20 flex-shrink-0'} />
              <span className="text-[13px] font-bold uppercase tracking-widest truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="py-3 md:py-4 mb-2 md:mb-4">
        <button 
          onClick={() => { handleLogout(); onMobileClose?.(); }}
          className="flex items-center space-x-4 px-4 md:px-5 py-3 md:py-4 w-full rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="text-[13px] font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>

      <div className="hidden md:block py-6 md:py-8 border-t border-white/5">
        <div className="glass-card bg-white/[0.02] border-white/5 p-4 md:p-6 rounded-3xl">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3">Support</div>
          <p className="text-[11px] text-white/40 leading-relaxed">Need help with your research? Contact our data team.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-black border-r border-white/5 h-[calc(100vh-6rem)] sticky top-24 flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Tablet Sidebar (collapsible) */}
      <aside className="hidden md:flex lg:hidden w-16 bg-black border-r border-white/5 h-[calc(100vh-6rem)] sticky top-24 flex-col flex-shrink-0 items-center py-4 overflow-hidden">
        <nav className="flex-1 space-y-3 mt-2 w-full px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.label} 
                to={item.path}
                className={`flex items-center justify-center w-full py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <item.icon size={20} />
              </Link>
            );
          })}
        </nav>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-white/5 transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* Mobile Sidebar (slide-in drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/10 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-lg font-serif font-medium text-white">Navigation</span>
                <button 
                  onClick={onMobileClose}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
