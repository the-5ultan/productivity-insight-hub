import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Database, 
  FileText, 
  Zap 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card flex items-center justify-between"
  >
    <div>
      <p className="text-secondary-accent text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
      <Icon className="text-primary-accent" size={24} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Analyses Completed" 
          value="24" 
          icon={BarChart3} 
          delay={0.1} 
        />
        <StatCard 
          title="Datasets Uploaded" 
          value="12" 
          icon={Database} 
          delay={0.2} 
        />
        <StatCard 
          title="Reports Generated" 
          value="18" 
          icon={FileText} 
          delay={0.3} 
        />
        <StatCard 
          title="Avg Productivity Score" 
          value="82%" 
          icon={Zap} 
          delay={0.4} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card h-80 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 to-transparent" />
          <p className="text-secondary-accent italic">Activity Chart Placeholder</p>
        </div>
        <div className="glass-card h-80 flex flex-col">
          <h3 className="text-lg mb-4">Recent Datasets</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center space-x-3">
                  <Database size={16} className="text-primary-accent" />
                  <span className="text-sm">Usage_Data_{i}.csv</span>
                </div>
                <span className="text-[10px] text-secondary-accent">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
