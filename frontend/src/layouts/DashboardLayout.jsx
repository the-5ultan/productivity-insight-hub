import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-black pt-24">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
