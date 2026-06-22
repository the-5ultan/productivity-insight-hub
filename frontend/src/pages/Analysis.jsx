import { useState, useEffect, useMemo } from 'react';
import { Play, TrendingUp, Zap, Target, BookOpen, AlertCircle, RefreshCw, BarChart, Sigma, Activity, GitCompare, X, CheckSquare } from 'lucide-react';
import { datasetAPI, analysisAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const FIELD_LABELS = {
  screen_time: 'Screen Time (hrs)',
  social_media_usage: 'Social Media (hrs)',
  study_time: 'Study Time (hrs)',
  sleep_duration: 'Sleep (hrs)',
  apps_used: 'Apps Used',
  productivity_score: 'Productivity Score'
};

const CORRELATION_FIELDS = [
  { field: 'screen_time', label: 'Screen Time' },
  { field: 'social_media_usage', label: 'Social Media Usage' },
  { field: 'study_time', label: 'Study Time' },
  { field: 'sleep_duration', label: 'Sleep Duration' },
  { field: 'apps_used', label: 'Apps Used' }
];

function getCorrelationInterpretation(r) {
  if (r === -1) return { strength: 'Perfect Negative Correlation', description: 'As one variable increases, the other decreases proportionally.' };
  if (r <= -0.5) return { strength: 'Strong Negative Correlation', description: 'There is a strong inverse relationship between the variables.' };
  if (r < 0) return { strength: 'Weak Negative Correlation', description: 'The variables show a slight inverse relationship.' };
  if (r === 0) return { strength: 'No Correlation', description: 'No linear relationship exists between the variables.' };
  if (r < 0.5) return { strength: 'Weak Positive Correlation', description: 'The variables move together slightly.' };
  if (r < 1) return { strength: 'Strong Positive Correlation', description: 'The variables have a strong direct relationship.' };
  if (r === 1) return { strength: 'Perfect Positive Correlation', description: 'Both variables increase together proportionally.' };
  return { strength: 'Unknown', description: '' };
}

function getCorrelationColor(r) {
  const abs = Math.abs(r);
  if (abs < 0.05) return { text: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
  if (abs < 0.3) return { text: 'text-gray-300', bg: 'bg-gray-300/10', border: 'border-gray-300/20' };
  if (abs < 0.5) return { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
  if (abs < 0.7) return { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
  return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
}

function getHeatColor(val) {
  if (val == null) return 'bg-gray-800';
  const abs = Math.abs(val);
  const intensity = Math.min(Math.floor(abs * 255), 255);
  if (val > 0) return `rgba(16, 185, 129, ${abs})`;
  if (val < 0) return `rgba(239, 68, 68, ${abs})`;
  return 'rgba(75, 85, 99, 0.3)';
}

function formatStat(value, decimals = 2) {
  if (value == null || !isFinite(value)) return 'N/A';
  return Number(value).toFixed(decimals);
}

const Analysis = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [singleResult, setSingleResult] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [comparePairVar, setComparePairVar] = useState('productivity_score');

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    setLoadingDatasets(true);
    try {
      const response = await datasetAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
      setDatasets(data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      setDatasets([]);
    } finally {
      setLoadingDatasets(false);
    }
  };

  const toggleDataset = (id) => {
    setSelectedDatasets(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
    setSingleResult(null);
    setComparisonResult(null);
  };

  const runAnalysis = async () => {
    if (selectedDatasets.length !== 1) return;
    setAnalyzing(true);
    setComparisonResult(null);
    try {
      const response = await analysisAPI.run({ datasetId: selectedDatasets[0] });
      setSingleResult(response.data);
    } catch (error) {
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const runComparison = async () => {
    if (selectedDatasets.length < 2) return;
    setAnalyzing(true);
    setSingleResult(null);
    try {
      const response = await analysisAPI.compareMulti({ datasetIds: selectedDatasets });
      setComparisonResult(response.data);
    } catch (error) {
      alert('Comparison failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setAnalyzing(false);
    }
  };

  const stats = singleResult?.stats;
  const numericFields = stats?.descriptive ? Object.keys(stats.descriptive) : [];

  // Scatter data for pair comparison view
  const pairScatterData = useMemo(() => {
    if (!comparisonResult) return [];
    return comparisonResult.datasets.map(ds => {
      const records = ds.descriptive?.[comparePairVar];
      if (!records) return null;
      return {
        name: ds.name,
        mean: records.mean ?? 0,
        stdDev: records.stdDev ?? 0
      };
    }).filter(Boolean);
  }, [comparisonResult, comparePairVar]);

  // Find strongest cross-correlation
  const strongestPair = useMemo(() => {
    if (!comparisonResult?.crossCorrelation) return null;
    const ids = Object.keys(comparisonResult.crossCorrelation);
    let maxAbs = 0, best = null;
    for (const id1 of ids) {
      for (const id2 of ids) {
        if (id1 >= id2) continue;
        const val = comparisonResult.crossCorrelation[id1][id2];
        const abs = Math.abs(val);
        if (abs > maxAbs) { maxAbs = abs; best = { id1, id2, val }; }
      }
    }
    return best;
  }, [comparisonResult]);

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10 pb-12 md:pb-16 lg:pb-20">
      {/* Dataset Selector */}
      <div className="glass-card border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-serif text-white mb-1">Statistical Analysis Engine</h2>
          <p className="text-xs sm:text-sm text-white/40 font-light tracking-wide">
            {selectedDatasets.length === 0
              ? 'Select one dataset to analyze, or two or more to compare.'
              : selectedDatasets.length === 1
                ? 'Click "Analyze" to run single-dataset analysis.'
                : `Click "Compare" to run cross-dataset analysis across ${selectedDatasets.length} datasets.`}
          </p>
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
          <>
            {/* Selected chips */}
            {selectedDatasets.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 mr-1">Selected:</span>
                {selectedDatasets.map(id => {
                  const ds = datasets.find(d => d.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 text-[11px] bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-white/80">
                      {ds?.dataset_name || id}
                      <button onClick={() => toggleDataset(id)} className="text-white/30 hover:text-white transition-colors">
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Dataset cards with checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {datasets.map(ds => {
                const isSelected = selectedDatasets.includes(ds.id);
                return (
                  <div
                    key={ds.id}
                    onClick={() => toggleDataset(ds.id)}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-white/10 border-white/30 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm mb-1 truncate">{ds.dataset_name}</div>
                        {ds.description && (
                          <div className="text-white/30 text-xs font-light truncate">{ds.description}</div>
                        )}
                      </div>
                      <div className={`ml-3 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-white border-white' : 'border-white/20'
                      }`}>
                        {isSelected && <CheckSquare size={14} className="text-black" />}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/50">Selected</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-[11px] sm:text-xs text-white/30 font-light">
            {selectedDatasets.length > 0 && (
              <span><span className="text-white/60 font-medium">{selectedDatasets.length}</span> dataset{selectedDatasets.length > 1 ? 's' : ''} selected</span>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3">
            {selectedDatasets.length === 1 && (
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="btn-primary flex items-center space-x-2 sm:space-x-3 px-5 sm:px-8 py-3 sm:py-4 disabled:opacity-40 tracking-widest uppercase text-[11px] sm:text-[12px] font-bold"
              >
                {analyzing ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
                <span>{analyzing ? 'Processing' : 'Analyze'}</span>
              </button>
            )}
            {selectedDatasets.length >= 2 && (
              <button
                onClick={runComparison}
                disabled={analyzing}
                className="btn-primary flex items-center space-x-2 sm:space-x-3 px-5 sm:px-8 py-3 sm:py-4 disabled:opacity-40 tracking-widest uppercase text-[11px] sm:text-[12px] font-bold"
              >
                {analyzing ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <GitCompare size={14} />
                )}
                <span>{analyzing ? 'Processing' : 'Compare All'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* SINGLE DATASET RESULTS */}
        {singleResult && stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 md:space-y-8 lg:space-y-10"
          >
            <div className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Sigma size={20} className="text-white/60" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white">Statistics Summary</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {numericFields.map(field => {
                  const d = stats.descriptive[field];
                  if (!d) return null;
                  return (
                    <div key={field} className="bg-white/5 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 space-y-3 md:space-y-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{FIELD_LABELS[field] || field}</div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Mean</span><span className="text-white font-medium">{formatStat(d.mean)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Median</span><span className="text-white font-medium">{formatStat(d.median)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Mode</span><span className="text-white font-medium">{Array.isArray(d.mode) ? d.mode.map(m => formatStat(m)).join(', ') : 'N/A'}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Variance</span><span className="text-white font-medium">{formatStat(d.variance)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Std Dev</span><span className="text-white font-medium">{formatStat(d.stdDev)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Range</span><span className="text-white font-medium">{formatStat(d.range)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Min</span><span className="text-white font-medium">{formatStat(d.min)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Max</span><span className="text-white font-medium">{formatStat(d.max)}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Activity size={20} className="text-white/60" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white">Correlation Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {CORRELATION_FIELDS.map(({ field, label }) => {
                  const r = stats.correlationMatrix?.productivity_score?.[field];
                  if (r == null) return null;
                  const r2 = r * r;
                  const colors = getCorrelationColor(r);
                  const interpretation = getCorrelationInterpretation(r);
                  return (
                    <div key={field} className={`rounded-3xl border p-6 space-y-4 ${colors.bg} ${colors.border}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{label} vs Productivity</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>{interpretation.strength}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">Pearson R</span><span className={`text-2xl font-serif ${colors.text}`}>{formatStat(r, 4)}</span></div>
                        <div><span className="text-[9px] font-bold uppercase tracking-wider text-white/20 block">R² (Determination)</span><span className={`text-2xl font-serif ${colors.text}`}>{formatStat(r2, 4)}</span></div>
                      </div>
                      <div className="pt-2 border-t border-white/5"><p className="text-xs text-white/50 leading-relaxed">{interpretation.description}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card bg-white/[0.02] border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10"><BookOpen size={24} className="text-white/60" /></div>
                <h3 className="text-2xl font-serif text-white">Problem Identification</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div><span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 block mb-3">Core Problem</span><p className="text-white/70 font-light leading-relaxed">{stats.problemIdentification.problem}</p></div>
                  <div><span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 block mb-3">Requirement</span><p className="text-white/70 font-light italic leading-relaxed">{stats.problemIdentification.statisticalRequirement}</p></div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 block">Conflicting Variables</span>
                  {Array.isArray(stats.problemIdentification.conflictingVariables) ? stats.problemIdentification.conflictingVariables.map((v, i) => (
                    <div key={i} className="space-y-2 border-l-2 border-white/10 pl-6">
                      <div className="flex gap-2">{Array.isArray(v.variables) ? v.variables.map(varName => (
                        <span key={varName} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-white/40">{varName}</span>
                      )) : null}</div>
                      <p className="text-sm text-white/60 font-light">{v.conflict}</p>
                    </div>
                  )) : <p className="text-sm text-white/30 italic">No conflicting variables identified</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center space-x-3 mb-6 text-white/40"><TrendingUp size={18} /><h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Insights Engine</h3></div>
                <div className="space-y-4">
                  {Array.isArray(stats.insights) ? stats.insights.slice(0, 2).map((insight, i) => (
                    <p key={i} className="text-lg font-serif italic text-white/80 leading-snug">"{insight}"</p>
                  )) : <p className="text-sm text-white/30 italic">No insights available</p>}
                </div>
              </div>
              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center space-x-3 mb-6 text-green-400/60"><Zap size={18} /><h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Mean Productivity</h3></div>
                <p className="text-7xl font-serif text-white mb-4">
                  {stats.descriptive.productivity_score.mean != null ? (stats.descriptive.productivity_score.mean * 10).toFixed(0) : "N/A"}<span className="text-3xl text-white/20">%</span>
                </p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stats.descriptive.productivity_score.mean != null ? stats.descriptive.productivity_score.mean * 10 : 0}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-green-400/40" />
                </div>
              </div>
              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center space-x-3 mb-6 text-blue-400/60"><Target size={18} /><h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Peak Probability</h3></div>
                <p className="text-7xl font-serif text-white mb-4">{stats.probabilities.highProductivity != null ? (stats.probabilities.highProductivity * 100).toFixed(0) : "N/A"}<span className="text-3xl text-white/20">%</span></p>
                <p className="text-xs text-white/30 font-light leading-relaxed">Mathematical probability of reaching high productivity (score ≥ 7) based on usage trends.</p>
              </div>
            </div>

            <div className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8"><div className="p-2 sm:p-3 rounded-2xl bg-red-400/5 border border-red-400/10 text-red-400/40"><AlertCircle size={20} /></div><h3 className="text-xl sm:text-2xl font-serif text-white">Variable Removal Impact</h3></div>
              <div className="bg-white/5 border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8 border-b border-white/5 bg-white/[0.01]"><p className="text-xs sm:text-sm font-light text-white/60">Experiment: Removing <span className="text-white font-medium">{stats.impactAnalysis.removedVariable}</span> from the predictive model.</p></div>
                <div className="overflow-x-auto -mx-5 sm:-mx-0">
                  <div className="inline-block min-w-full align-middle px-5 sm:px-0">
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20"><th className="px-8 py-5">Remaining Variable</th><th className="px-8 py-5">Original Corr</th><th className="px-8 py-5">Post-Removal Corr</th><th className="px-8 py-5 text-right">Net Change</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {Array.isArray(stats.impactAnalysis.comparisons) ? stats.impactAnalysis.comparisons.map((c, i) => (
                        <tr key={i} className="text-sm font-light text-white/70">
                          <td className="px-8 py-5">{c.variable}</td>
                          <td className="px-8 py-5">{c.before != null ? Number(c.before).toFixed(3) : "N/A"}</td>
                          <td className="px-8 py-5">{c.after != null ? Number(c.after).toFixed(3) : "N/A"}</td>
                          <td className={`px-8 py-5 text-right font-medium ${c.change != null && c.change > 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>{c.change != null && c.change > 0 ? '+' : ''}{c.change != null ? Number(c.change).toFixed(3) : "N/A"}</td>
                        </tr>
                      )) : <tr><td colSpan="4" className="px-8 py-5 text-sm text-white/30 italic">Insufficient data for impact analysis</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center gap-3 mb-8"><BarChart size={20} className="text-white/40" /><h3 className="text-xl font-serif text-white">Regression Prediction</h3></div>
                {stats.advancedAnalysis.regression ? <>
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 mb-6 text-center"><div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-4">Regression Equation</div><p className="text-4xl font-serif text-white">{stats.advancedAnalysis.regression.equation}</p></div>
                  <p className="text-sm text-white/40 font-light leading-relaxed">Predicting <span className="text-white">{stats.advancedAnalysis.regression.dependent}</span> based on <span className="text-white">{stats.advancedAnalysis.regression.independent}</span> trends using a linear modeling approach.</p>
                </> : <p className="text-sm text-white/30 italic">Regression data not available</p>}
              </div>
              <div className="glass-card bg-white/[0.02] border-white/5">
                <div className="flex items-center gap-3 mb-8"><RefreshCw size={20} className="text-white/40" /><h3 className="text-xl font-serif text-white">Advanced Modeling</h3></div>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-2">Weighted Index</span>
                    <div className="flex items-end gap-2"><p className="text-2xl font-serif text-white">{stats.advancedAnalysis.weightedIndex.average != null ? Number(stats.advancedAnalysis.weightedIndex.average).toFixed(2) : "N/A"}</p><span className="text-[10px] text-white/40 mb-1">Composite Score</span></div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-2">MCDA Top Students</span>
                    <div className="flex gap-4">
                      {Array.isArray(stats.advancedAnalysis.mcda.topPerformers) ? stats.advancedAnalysis.mcda.topPerformers.map((p, i) => (
                        <div key={i} className="flex-1 text-center py-2 bg-white/5 rounded-xl border border-white/5"><div className="text-[9px] text-white/30 font-bold mb-1">ID: {p.studentId}</div><div className="text-sm text-white font-medium">{p.score != null ? Number(p.score).toFixed(1) : "N/A"}</div></div>
                      )) : <p className="text-sm text-white/30 italic">No performers data</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MULTI-DATASET COMPARISON RESULTS */}
        {comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 md:space-y-8 lg:space-y-10"
          >
            {/* Cross-Dataset Correlation Matrix */}
            <div className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
                  <GitCompare size={20} className="text-white/60" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white">Cross-Dataset Correlation Matrix</h3>
              </div>

              {strongestPair && (
                <div className="mb-4 md:mb-6 bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/5 text-xs sm:text-sm">
                  <span className="text-white/40">Strongest relationship: </span>
                  <span className="text-white font-medium">
                    {comparisonResult.datasets.find(d => d.id === strongestPair.id1)?.name}
                  </span>
                  <span className="text-white/40"> ↔ </span>
                  <span className="text-white font-medium">
                    {comparisonResult.datasets.find(d => d.id === strongestPair.id2)?.name}
                  </span>
                  <span className="text-white/40"> (r = </span>
                  <span className={strongestPair.val >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatStat(strongestPair.val, 4)}</span>
                  <span className="text-white/40">, </span>
                  <span className="text-white/40">{getCorrelationInterpretation(strongestPair.val).strength}</span>
                  <span className="text-white/40">)</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                      <th className="px-6 py-4 w-48">Dataset</th>
                      {comparisonResult.datasets.map(ds => (
                        <th key={ds.id} className="px-6 py-4 text-center">{ds.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {comparisonResult.datasets.map((ds1, i) => (
                      <tr key={ds1.id} className="text-sm font-light text-white/70">
                        <td className="px-6 py-4 font-medium text-white/80">{ds1.name}</td>
                        {comparisonResult.datasets.map((ds2, j) => {
                          const val = comparisonResult.crossCorrelation[ds1.id]?.[ds2.id];
                          const isDiag = i === j;
                          const interpretation = getCorrelationInterpretation(val);
                          const interpretColor = interpretation.strength.includes('Positive')
                            ? 'text-emerald-400' : interpretation.strength.includes('Negative')
                              ? 'text-red-400' : 'text-gray-400';
                          return (
                            <td key={ds2.id} className="px-6 py-4 text-center">
                              <div
                                className="inline-block rounded-xl px-4 py-2 min-w-[80px]"
                                style={{ backgroundColor: getHeatColor(val) }}
                              >
                                <div className={`text-sm font-mono ${isDiag ? 'text-white' : interpretColor}`}>
                                  {isDiag ? '—' : formatStat(val, 4)}
                                </div>
                                {!isDiag && (
                                  <div className="text-[8px] text-white/40 uppercase tracking-wider mt-0.5">
                                    {interpretation.strength.split(' ').slice(0, 2).join(' ')}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side-by-Side Statistics */}
            <div className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Sigma size={20} className="text-white/60" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white">Statistics Comparison</h3>
              </div>

              {comparisonResult.commonFields.map(field => (
                <div key={field} className="mb-6 md:mb-8 last:mb-0">
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/30 mb-3 sm:mb-4 px-1 sm:px-2">{FIELD_LABELS[field] || field}</div>
                  <div className="overflow-x-auto -mx-5 sm:-mx-0">
                    <div className="inline-block min-w-full align-middle px-5 sm:px-0">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                          <th className="px-6 py-4 w-40">Dataset</th>
                          <th className="px-6 py-4 text-center">Records</th>
                          <th className="px-6 py-4 text-center">Mean</th>
                          <th className="px-6 py-4 text-center">Median</th>
                          <th className="px-6 py-4 text-center">Std Dev</th>
                          <th className="px-6 py-4 text-center">Variance</th>
                          <th className="px-6 py-4 text-center">Min</th>
                          <th className="px-6 py-4 text-center">Max</th>
                          <th className="px-6 py-4 text-center">Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {comparisonResult.datasets.map(ds => {
                          const d = ds.descriptive?.[field];
                          return (
                            <tr key={ds.id} className="text-sm font-light text-white/70">
                              <td className="px-6 py-4 font-medium text-white/80">{ds.name}</td>
                              <td className="px-6 py-4 text-center">{ds.recordCount}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.mean) : 'N/A'}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.median) : 'N/A'}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.stdDev) : 'N/A'}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.variance) : 'N/A'}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.min) : 'N/A'}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.max) : 'N/A'}</td>
                              <td className="px-6 py-4 text-center font-mono">{d ? formatStat(d.range) : 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Pairwise Variable Scatter Comparison */}
            <div className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10">
                  <BarChart size={20} className="text-white/60" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white">Field Mean Comparison</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6 bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/5">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Variable:</span>
                <select
                  value={comparePairVar}
                  onChange={(e) => setComparePairVar(e.target.value)}
                  className="bg-[rgba(20,20,20,0.75)] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  {comparisonResult.commonFields.map(f => (
                    <option key={f} value={f} className="bg-[#111827] text-white">{FIELD_LABELS[f] || f}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                      <th className="px-6 py-4">Dataset</th>
                      <th className="px-6 py-4 text-center">Mean</th>
                      <th className="px-6 py-4 text-center">Std Dev</th>
                      <th className="px-6 py-4">Distribution Bar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {comparisonResult.datasets.map(ds => {
                      const d = ds.descriptive?.[comparePairVar];
                      if (!d) return null;
                      const maxMean = Math.max(...comparisonResult.datasets.map(x => x.descriptive?.[comparePairVar]?.mean ?? 0));
                      const barWidth = maxMean > 0 ? (d.mean / maxMean) * 100 : 0;
                      return (
                        <tr key={ds.id} className="text-sm font-light text-white/70">
                          <td className="px-6 py-4 font-medium text-white/80">{ds.name}</td>
                          <td className="px-6 py-4 text-center font-mono">{formatStat(d.mean)}</td>
                          <td className="px-6 py-4 text-center font-mono">{formatStat(d.stdDev)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-white/30 rounded-full transition-all duration-1000" style={{ width: `${barWidth}%` }} />
                              </div>
                              <span className="text-[10px] text-white/30 w-10 text-right">{barWidth.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights Per Dataset */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {comparisonResult.datasets.map(ds => (
                <div key={ds.id} className="glass-card bg-white/[0.02] border-white/5 p-5 sm:p-6 md:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
                      <Activity size={18} className="text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-serif text-white truncate">{ds.name}</h3>
                      <p className="text-[9px] sm:text-[10px] text-white/30 font-bold uppercase tracking-wider">{ds.recordCount} records</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(ds.insights) ? ds.insights.slice(0, 3).map((insight, i) => (
                      <p key={i} className="text-sm text-white/60 font-light leading-relaxed">• {insight}</p>
                    )) : <p className="text-sm text-white/30 italic">No insights available</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!singleResult && !comparisonResult && selectedDatasets.length > 0 && !analyzing && (
        <div className="glass-card py-20 text-center">
          <p className="text-white/30 italic">
            {selectedDatasets.length === 1
              ? 'Click "Analyze" to run analysis on the selected dataset.'
              : 'Click "Compare All" to run cross-dataset comparison.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Analysis;
