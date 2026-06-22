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
    className="glass-card flex items-center justify-between p-5 md:p-6 lg:p-8 xl:p-10"
  >
    <div className="min-w-0">
      <p className="text-secondary-accent text-xs sm:text-sm mb-1 truncate">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
    </div>
    <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 flex-shrink-0 ml-3">
      <Icon className="text-primary-accent" size={20} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 glass-card h-64 sm:h-72 md:h-80 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 to-transparent" />
          <p className="text-secondary-accent italic text-sm sm:text-base">Activity Chart Placeholder</p>
        </div>
        <div className="glass-card h-auto min-h-[16rem] sm:min-h-[18rem] md:min-h-[20rem] flex flex-col">
          <h3 className="text-base sm:text-lg mb-3 md:mb-4">Recent Datasets</h3>
          <div className="space-y-2 md:space-y-4 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <Database size={14} className="text-primary-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">Usage_Data_{i}.csv</span>
                </div>
                <span className="text-[10px] text-secondary-accent flex-shrink-0 ml-2">{i * 2}h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
