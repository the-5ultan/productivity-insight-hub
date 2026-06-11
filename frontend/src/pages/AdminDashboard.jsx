import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Database, FileText, Activity, ShieldAlert, Cpu } from 'lucide-react';
import api from '../services/api';

const AdminStat = ({ title, value, icon: Icon, color }) => (
  <div className="glass-card p-6 flex items-center space-x-4">
    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-secondary-accent text-xs uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
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
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Administration</h2>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase">
          <Cpu size={12} />
          <span>System Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminStat title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
        <AdminStat title="Active Datasets" value={stats.totalDatasets} icon={Database} color="text-purple-400" />
        <AdminStat title="Reports Generated" value={stats.totalReports} icon={FileText} color="text-green-400" />
        <AdminStat title="Guest Sessions" value={stats.totalGuestSessions} icon={ShieldAlert} color="text-orange-400" />
        <div className="glass-card col-span-1 md:col-span-2 flex items-center justify-between bg-primary-accent/5 border-primary-accent/20">
          <div>
            <p className="text-primary-accent text-xs font-bold uppercase mb-1">Most Influential Productivity Factor</p>
            <h3 className="text-2xl font-display font-bold italic">{stats.mostInfluential}</h3>
          </div>
          <Activity className="text-primary-accent opacity-20" size={48} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <h3 className="text-lg mb-6">User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-secondary-accent uppercase text-[10px] tracking-widest">
                  <th className="pb-4 font-medium">User</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Joined</th>
                  <th className="pb-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium">{user.name}</td>
                    <td className="py-4 text-secondary-accent">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-primary-accent text-background' : 'bg-white/10 text-secondary-accent'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-secondary-accent">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-4">
                      <button className="text-xs text-secondary-accent hover:text-primary-accent underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary-accent" />
                <div>
                  <p className="text-xs text-primary-accent font-medium">User Login</p>
                  <p className="text-xs text-secondary-accent">John Doe signed in via Google</p>
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
