import { useState, useEffect } from 'react';
import { Play, TrendingUp, Zap, Target, BookOpen, AlertCircle, RefreshCw, BarChart } from 'lucide-react';
import { datasetAPI, analysisAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Analysis = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    setLoadingDatasets(true);
    try {
      const response = await datasetAPI.getAll();
      if (Array.isArray(response.data)) {
        setDatasets(response.data);
      } else if (Array.isArray(response.data?.data)) {
        setDatasets(response.data.data);
      } else {
        console.warn('Unexpected API response format:', response.data);
        setDatasets([]);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
      setDatasets([]);
    } finally {
      setLoadingDatasets(false);
    }
  };

  const runAnalysis = async () => {
    if (!selectedDataset) return;
    setAnalyzing(true);
    try {
      console.log("Calling analysis endpoint:", '/analysis/run');
      const response = await analysisAPI.run({ datasetId: selectedDataset });
      setResults(response.data);
    } catch (error) {
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedDs = datasets.find(ds => ds.id === selectedDataset);

  return (
    <div className="space-y-10 pb-20">
      <div className="glass-card border-white/10 bg-white/5">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-1">Statistical Analysis Engine</h2>
          <p className="text-sm text-white/40 font-light tracking-wide">Select a research dataset to run comprehensive productivity modeling.</p>
        </div>

        {loadingDatasets ? (
          <div className="flex items-center gap-3 text-white/40 py-4">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-sm">Loading datasets...</span>
          </div>
        ) : datasets.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-6">
            <p className="text-white/40 text-sm mb-2">No datasets available.</p>
            <p className="text-white/20 text-xs">Upload a dataset from the Datasets page first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {datasets.map(ds => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds.id)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                  selectedDataset === ds.id
                    ? 'bg-white/10 border-white/30 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-white font-medium text-sm mb-1 truncate">
                  {ds.dataset_name}
                </div>
                {ds.description && (
                  <div className="text-white/30 text-xs font-light truncate">
                    {ds.description}
                  </div>
                )}
                {selectedDataset === ds.id && (
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {selectedDs && (
            <div className="text-xs text-white/30 font-light">
              Selected: <span className="text-white/60 font-medium">{selectedDs.dataset_name}</span>
            </div>
          )}
          <button
            onClick={runAnalysis}
            disabled={analyzing || !selectedDataset}
            className="btn-primary flex items-center space-x-3 px-10 py-4 disabled:opacity-40 tracking-widest uppercase text-[12px] font-bold ml-auto"
          >
            {analyzing ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            <span>{analyzing ? 'Processing' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            {/* Part A: Problem Identification */}
            <div className="glass-card bg-white/[0.02] border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <BookOpen size={24} className="text-white/60" />
                </div>
                <h3 className="text-2xl font-serif text-white">Problem Identification</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 block mb-3">Core Problem</span>
                    <p className="text-white/70 font-light leading-relaxed">{results.stats.problemIdentification.problem}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 block mb-3">Requirement</span>
                    <p className="text-white/70 font-light italic leading-relaxed">{results.stats.problemIdentification.statisticalRequirement}</p>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 block">Conflicting Variables</span>
                  {results.stats.problemIdentification.conflictingVariables.map((v, i) => (
                    <div key={i} className="space-y-2 border-l-2 border-white/10 pl-6">
                      <div className="flex gap-2">
                        {v.variables.map(varName => (
                          <span key={varName} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-white/40">{varName}</span>
                        ))}
                      </div>
                      <p className="text-sm text-white/60 font-light">{v.conflict}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card bg-white/[0.02] border-white/5 hover:bg-white/5 transition-all duration-700">
                <div className="flex items-center space-x-3 mb-6 text-white/40">
                  <TrendingUp size={18} />
                  <h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Insights Engine</h3>
                </div>
                <div className="space-y-4">
                  {results.stats.insights.slice(0, 2).map((insight, i) => (
                    <p key={i} className="text-lg font-serif italic text-white/80 leading-snug">
                      "{insight}"
                    </p>
                  ))}
                </div>
              </div>

              <div className="glass-card bg-white/[0.02] border-white/5 hover:bg-white/5 transition-all duration-700">
                <div className="flex items-center space-x-3 mb-6 text-green-400/60">
                  <Zap size={18} />
                  <h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Mean Productivity</h3>
                </div>
                <p className="text-7xl font-serif text-white mb-4">
                  {(results.stats.descriptive.productivity_score.mean * 10).toFixed(0)}<span className="text-3xl text-white/20">%</span>
                </p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${results.stats.descriptive.productivity_score.mean * 10}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-green-400/40" 
                  />
                </div>
              </div>

              <div className="glass-card bg-white/[0.02] border-white/5 hover:bg-white/5 transition-all duration-700">
                <div className="flex items-center space-x-3 mb-6 text-blue-400/60">
                  <Target size={18} />
                  <h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Peak Probability</h3>
                </div>
                <p className="text-7xl font-serif text-white mb-4">
                  {(results.stats.probabilities.highProductivity * 100).toFixed(0)}<span className="text-3xl text-white/20">%</span>
                </p>
                <p className="text-xs text-white/30 font-light leading-relaxed">
                  Mathematical probability of reaching high productivity (score ≥ 7) based on usage trends.
                </p>
              </div>
            </div>

            {/* Part C: Impact Analysis */}
            <div className="glass-card bg-white/[0.02] border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-red-400/5 border border-red-400/10 text-red-400/40">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-2xl font-serif text-white">Variable Removal Impact</h3>
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                   <p className="text-sm font-light text-white/60">Experiment: Removing <span className="text-white font-medium">{results.stats.impactAnalysis.removedVariable}</span> from the predictive model.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                        <th className="px-8 py-5">Remaining Variable</th>
                        <th className="px-8 py-5">Original Corr</th>
                        <th className="px-8 py-5">Post-Removal Corr</th>
                        <th className="px-8 py-5 text-right">Net Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {results.stats.impactAnalysis.comparisons.map((c, i) => (
                        <tr key={i} className="text-sm font-light text-white/70">
                          <td className="px-8 py-5">{c.variable}</td>
                          <td className="px-8 py-5">{c.before.toFixed(3)}</td>
                          <td className="px-8 py-5">{c.after.toFixed(3)}</td>
                          <td className={`px-8 py-5 text-right font-medium ${c.change > 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
                            {c.change > 0 ? '+' : ''}{c.change.toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Part D: Predictive & Advanced Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart size={20} className="text-white/40" />
                  <h3 className="text-xl font-serif text-white">Regression Prediction</h3>
                </div>
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 mb-6 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-4">Regression Equation</div>
                  <p className="text-4xl font-serif text-white">{results.stats.advancedAnalysis.regression.equation}</p>
                </div>
                <p className="text-sm text-white/40 font-light leading-relaxed">
                  Predicting <span className="text-white">{results.stats.advancedAnalysis.regression.dependent}</span> based on <span className="text-white">{results.stats.advancedAnalysis.regression.independent}</span> trends using a linear modeling approach.
                </p>
              </div>

              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <RefreshCw size={20} className="text-white/40" />
                  <h3 className="text-xl font-serif text-white">Advanced Modeling</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-2">Weighted Index</span>
                    <div className="flex items-end gap-2">
                       <p className="text-2xl font-serif text-white">{results.stats.advancedAnalysis.weightedIndex.average.toFixed(2)}</p>
                       <span className="text-[10px] text-white/40 mb-1">Composite Score</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-2">MCDA Top Students</span>
                    <div className="flex gap-4">
                      {results.stats.advancedAnalysis.mcda.topPerformers.map((p, i) => (
                        <div key={i} className="flex-1 text-center py-2 bg-white/5 rounded-xl border border-white/5">
                           <div className="text-[9px] text-white/30 font-bold mb-1">ID: {p.studentId}</div>
                           <div className="text-sm text-white font-medium">{p.score.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analysis;
