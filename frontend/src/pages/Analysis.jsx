import { useState, useEffect } from 'react';
import { Play, TrendingUp, Zap, Target } from 'lucide-react';
import { datasetAPI, analysisAPI } from '../services/api';

const Analysis = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await datasetAPI.getAll();
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const runAnalysis = async () => {
    if (!selectedDataset) return;
    setAnalyzing(true);
    try {
      const response = await analysisAPI.run({ datasetId: selectedDataset });
      setResults(response.data);
    } catch (error) {
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl mb-1">Statistical Analysis Engine</h2>
          <p className="text-sm text-secondary-accent">Select a dataset to run advanced productivity modeling.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-accent"
          >
            <option value="">Select Dataset...</option>
            {datasets.map(ds => (
              <option key={ds.id} value={ds.id}>{ds.dataset_name}</option>
            ))}
          </select>
          <button 
            onClick={runAnalysis}
            disabled={analyzing || !selectedDataset}
            className="btn-primary flex items-center space-x-2 px-6 py-3 disabled:opacity-50"
          >
            <Play size={18} fill="currentColor" />
            <span>{analyzing ? 'Analyzing...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-4 text-primary-accent">
              <TrendingUp size={20} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Top Influencer</h3>
            </div>
            <p className="text-2xl font-display italic mb-2">
              {results.stats.conclusions[0]?.split(' ')[0] || 'N/A'}
            </p>
            <p className="text-xs text-secondary-accent leading-relaxed">
              This factor shows the strongest statistical correlation with your productivity score.
            </p>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-4 text-green-400">
              <Zap size={20} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Efficiency Rating</h3>
            </div>
            <p className="text-2xl font-display italic mb-2">
              {(results.stats.descriptive.productivity_score.mean * 10).toFixed(1)}%
            </p>
            <p className="text-xs text-secondary-accent leading-relaxed">
              Based on your mean productivity score across all recorded digital sessions.
            </p>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-4 text-blue-400">
              <Target size={20} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Success Probability</h3>
            </div>
            <p className="text-2xl font-display italic mb-2">
              {(results.stats.probabilities.highProductivity * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-secondary-accent leading-relaxed">
              Probability of achieving peak performance given your current usage habits.
            </p>
          </div>

          <div className="md:col-span-3 glass-card">
            <h3 className="text-lg mb-6">Detailed Findings</h3>
            <div className="space-y-4">
              {results.stats.conclusions.map((c, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                   <p className="text-sm">{c}</p>
                   <span className="text-[10px] font-bold text-primary-accent uppercase tracking-widest">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
