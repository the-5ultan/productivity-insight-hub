import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Database, FileText, Activity, ShieldAlert, Cpu } from 'lucide-react';
import api from '../services/api';

const AdminStat = ({ title, value, icon: Icon, color }) => (
  <div className="glass-card p-4 sm:p-5 md:p-6 flex items-center space-x-3 sm:space-x-4">
    <div className={`p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 ${color} flex-shrink-0`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-secondary-accent text-[10px] sm:text-xs uppercase tracking-wider mb-1 truncate">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Admin fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-primary-accent italic">Loading System Stats...</div>;

  return (
    <div className="space-y-6 md:space-y-8 pb-8 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">System Administration</h2>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase flex-shrink-0">
          <Cpu size={12} />
          <span>System Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AdminStat title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
        <AdminStat title="Active Datasets" value={stats.totalDatasets} icon={Database} color="text-purple-400" />
        <AdminStat title="Reports Generated" value={stats.totalReports} icon={FileText} color="text-green-400" />
        <AdminStat title="Guest Sessions" value={stats.totalGuestSessions} icon={ShieldAlert} color="text-orange-400" />
        <div className="glass-card col-span-1 sm:col-span-2 flex items-center justify-between bg-primary-accent/5 border-primary-accent/20 p-4 sm:p-5 md:p-6">
          <div className="min-w-0">
            <p className="text-primary-accent text-[10px] sm:text-xs font-bold uppercase mb-1">Most Influential Productivity Factor</p>
            <h3 className="text-xl sm:text-2xl font-display font-bold italic truncate">{stats.mostInfluential}</h3>
          </div>
          <Activity className="text-primary-accent opacity-20 flex-shrink-0 ml-4" size={36} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <h3 className="text-base sm:text-lg mb-4 md:mb-6">User Management</h3>
          <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-secondary-accent uppercase text-[9px] sm:text-[10px] tracking-widest">
                    <th className="pb-3 sm:pb-4 pr-2 sm:pr-4 font-medium whitespace-nowrap">User</th>
                    <th className="pb-3 sm:pb-4 pr-2 sm:pr-4 font-medium whitespace-nowrap">Email</th>
                    <th className="pb-3 sm:pb-4 pr-2 sm:pr-4 font-medium whitespace-nowrap">Role</th>
                    <th className="pb-3 sm:pb-4 pr-2 sm:pr-4 font-medium whitespace-nowrap">Joined</th>
                    <th className="pb-3 sm:pb-4 font-medium whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(user => (
                    <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 font-medium truncate max-w-[100px] sm:max-w-[150px]">{user.name}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-secondary-accent truncate max-w-[120px] sm:max-w-[200px]">{user.email}</td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase whitespace-nowrap ${user.role === 'admin' ? 'bg-primary-accent text-background' : 'bg-white/10 text-secondary-accent'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 pr-2 sm:pr-4 text-secondary-accent whitespace-nowrap text-[10px] sm:text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 sm:py-4">
                        <button className="text-[10px] sm:text-xs text-secondary-accent hover:text-primary-accent underline whitespace-nowrap">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-base sm:text-lg mb-4 md:mb-6">Recent Activity</h3>
          <div className="space-y-4 sm:space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary-accent flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-primary-accent font-medium">User Login</p>
                  <p className="text-xs text-secondary-accent truncate">John Doe signed in via Google</p>
                  <p className="text-[10px] text-secondary-accent/50 mt-1">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
