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

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Database, label: 'Datasets', path: '/dashboard/datasets' },
    { icon: BarChart3, label: 'Analysis', path: '/dashboard/analysis' },
    { icon: PieChart, label: 'Visualizations', path: '/dashboard/visuals' },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 glass-card h-[calc(100vh-2rem)] sticky top-4 m-4 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-display font-bold tracking-tighter">TECHLYTICS</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-primary-accent text-background' 
                : 'hover:bg-white/5 text-secondary-accent hover:text-primary-accent'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-secondary-accent hover:text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
