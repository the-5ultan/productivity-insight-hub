import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="liquid-bg opacity-30" />
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl">Dashboard</h1>
            <p className="text-secondary-accent text-sm">Welcome back to your productivity insights.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary-accent flex items-center justify-center text-background font-bold">
              JD
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
