import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black pt-24">
      <Sidebar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      
      {/* Mobile menu toggle */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 left-6 z-30 md:hidden bg-white/10 border border-white/20 backdrop-blur-xl p-3 rounded-full text-white shadow-xl hover:bg-white/20 transition-all"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <main className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10 overflow-y-auto custom-scrollbar min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
