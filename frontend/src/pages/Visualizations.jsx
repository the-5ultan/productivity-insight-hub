import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Database, TrendingUp, Activity, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { datasetAPI, analysisAPI } from '../services/api';

const COLORS = ['#FFFFFF', '#9CA3AF', '#4B5563', '#1F2937', '#111827'];

const Visualizations = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await datasetAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
      console.log("Fetched datasets:", data);
      setDatasets(data);
      if (data.length > 0) {
        handleDatasetSelect(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const handleDatasetSelect = async (id) => {
    setLoading(true);
    try {
      console.log("Running analysis for dataset:", id);
      const response = await analysisAPI.run({ datasetId: id });
      console.log("Analysis result:", response.data);
      setSelectedDataset(id);
      setAnalysisData(response.data.stats);
    } catch (error) {
      console.error('Error running analysis:', error);
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-primary-accent italic">Analyzing Data...</div>;

  const getBarData = () => {
    if (!analysisData?.descriptive) return [];
    console.log("Bar chart data:", analysisData.descriptive);
    return Object.keys(analysisData.descriptive).map(key => ({
      name: key.replace('_', ' '),
      mean: analysisData.descriptive[key]?.mean != null ? Number(analysisData.descriptive[key].mean).toFixed(2) : "0.00"
    }));
  };

  const getCorrelationData = () => {
    if (!analysisData?.correlationMatrix?.productivity_score) return [];
    const prodCorr = analysisData.correlationMatrix.productivity_score;
    console.log("Correlation data:", prodCorr);
    return Object.keys(prodCorr).filter(k => k !== 'productivity_score').map(k => ({
      name: k.replace('_', ' '),
      correlation: prodCorr[k] != null ? Number(prodCorr[k]).toFixed(2) : "0.00"
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Visualizations</h2>
        {loading ? (
          <p className="text-sm text-primary-accent italic">Loading...</p>
        ) : (
        <select 
          onChange={(e) => handleDatasetSelect(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-accent"
        >
          {Array.isArray(datasets) && datasets.map(ds => (
            <option key={ds.id} value={ds.id}>{ds.dataset_name}</option>
          ))}
        </select>
        )}
      </div>

      {!analysisData ? (
        <div className="glass-card py-20 text-center">
          <p className="text-secondary-accent italic">Upload a dataset to see visualizations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mean Values Bar Chart */}
          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="text-primary-accent" size={20} />
              <h3 className="text-lg">Average Metrics</h3>
            </div>
            <div className="h-80 w-full">
              {getBarData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getBarData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="mean" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-full text-white/30 italic">No metric data available</div>}
            </div>
          </div>

          {/* Productivity Correlations Line Chart */}
          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="text-primary-accent" size={20} />
              <h3 className="text-lg">Productivity Correlations</h3>
            </div>
            <div className="h-80 w-full">
              {getCorrelationData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCorrelationData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis type="number" stroke="#9CA3AF" domain={[-1, 1]} />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="correlation" fill="#9CA3AF">
                    {getCorrelationData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.correlation > 0 ? '#FFFFFF' : '#4B5563'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-full text-white/30 italic">No correlation data available</div>}
            </div>
          </div>

          {/* AI Insights Panel (Phase 9) */}
          <div className="glass-card lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="text-primary-accent" size={20} />
              <h3 className="text-lg">AI Insights & Interpretations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {(analysisData.insights && Array.isArray(analysisData.insights) ? analysisData.insights : []).map((c, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary-accent" />
                    <p className="text-sm text-secondary-accent leading-relaxed">{c}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-primary-accent/5 rounded-2xl border border-primary-accent/10">
                <h4 className="text-primary-accent font-bold mb-2 uppercase text-xs tracking-widest">Key Probability</h4>
                <p className="text-4xl font-bold mb-4">
                  {analysisData.probabilities?.highProductivity != null ? (analysisData.probabilities.highProductivity * 100).toFixed(1) : "N/A"}%
                </p>
                <p className="text-secondary-accent text-sm italic">
                  Probability of achieving a high productivity score (&gt;7) based on your current behavior patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizations;
