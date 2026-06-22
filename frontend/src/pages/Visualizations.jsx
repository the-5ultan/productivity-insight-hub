import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Scatter, Line, ComposedChart
} from 'recharts';
import { TrendingUp, Activity, BarChart3, AlertCircle } from 'lucide-react';
import { datasetAPI, analysisAPI } from '../services/api';

const NUMERIC_FIELDS = ['screen_time', 'social_media_usage', 'study_time', 'sleep_duration', 'apps_used', 'productivity_score'];

const FIELD_LABELS = {
  screen_time: 'Screen Time',
  social_media_usage: 'Social Media Usage',
  study_time: 'Study Time',
  sleep_duration: 'Sleep Duration',
  apps_used: 'Apps Used',
  productivity_score: 'Productivity Score'
};

function calculateRegression(xValues, yValues) {
  const n = xValues.length;
  if (n < 2) return null;

  const meanX = xValues.reduce((s, v) => s + v, 0) / n;
  const meanY = yValues.reduce((s, v) => s + v, 0) / n;

  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xValues[i] - meanX;
    const dy = yValues[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const m = denX === 0 ? 0 : num / denX;
  const b = meanY - m * meanX;
  const r = denX === 0 || denY === 0 ? 0 : num / Math.sqrt(denX * denY);
  const r2 = r * r;

  return { m, b, r, r2, n };
}

function getCorrelationStrength(r) {
  const abs = Math.abs(r);
  if (abs < 0.05) return { label: 'No Correlation', color: '#9CA3AF' };
  if (abs < 0.3) return { label: 'Weak', color: '#6B7280' };
  if (abs < 0.7) return { label: 'Moderate', color: '#F59E0B' };
  return { label: 'Strong', color: '#10B981' };
}

function formatFieldName(field) {
  return FIELD_LABELS[field] || field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const Visualizations = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [datasetRecords, setDatasetRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [xVariable, setXVariable] = useState('study_time');
  const [yVariable, setYVariable] = useState('productivity_score');

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await datasetAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
      setDatasets(data);
      if (data.length > 0) {
        handleDatasetSelect(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const fetchDatasetRecords = async (id) => {
    try {
      const response = await datasetAPI.getById(id);
      console.log('[DEBUG] fetchDatasetRecords response:', JSON.stringify(response.data, null, 2));
      const records = response.data?.DatasetRecords || [];
      console.log('[DEBUG] Dataset ID:', id, '| Raw DatasetRecords count:', records.length);
      setDatasetRecords(records);
      return records;
    } catch (err) {
      console.error('[DEBUG] Error fetching dataset records:', err);
      setDatasetRecords([]);
      return [];
    }
  };

  const handleDatasetSelect = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const dsName = datasets.find(d => String(d.id) === String(id))?.dataset_name || 'Unknown';
      console.log('[DEBUG] === CORRELATION DEBUG ===');
      console.log('[DEBUG] 1. Selected Dataset ID:', id, '| Name:', dsName);
      console.log('[DEBUG]   Dataset ID Sent To API:', id);
      const [analysisRes, records] = await Promise.all([
        analysisAPI.run({ datasetId: id }),
        fetchDatasetRecords(id)
      ]);
      console.log('[DEBUG] 2. API Response Payload:', JSON.stringify(analysisRes.data, null, 2));
      console.log('[DEBUG] 3. Records Retrieved:', records.length);
      console.log('[DEBUG]   Records Used For Correlation:', records.filter(r => {
        const x = Number(r[xVariable]);
        const y = Number(r[yVariable]);
        return x != null && y != null && !isNaN(x) && !isNaN(y);
      }).length);
      setSelectedDataset(id);
      setAnalysisData(analysisRes.data.stats);
    } catch (error) {
      console.error('[DEBUG] Error running analysis:', error);
      setAnalysisData(null);
      setError(error.response?.data?.error || error.message || 'Failed to analyze dataset');
    } finally {
      setLoading(false);
    }
  };

  const scatterData = useMemo(() => {
    if (!datasetRecords || datasetRecords.length === 0) {
      console.log('[DEBUG] No dataset records available');
      return [];
    }
    const points = datasetRecords
      .map(r => ({
        x: Number(r[xVariable]),
        y: Number(r[yVariable])
      }))
      .filter(p => p.x != null && p.y != null && !isNaN(p.x) && !isNaN(p.y));
    console.log('[DEBUG] 4. X Variable:', xVariable, '| Y Variable:', yVariable);
    console.log('[DEBUG] 5. X Values:', points.map(p => p.x));
    console.log('[DEBUG] 6. Y Values:', points.map(p => p.y));
    console.log('[DEBUG] 7. Processed Records Count:', points.length);
    return points;
  }, [datasetRecords, xVariable, yVariable]);

  const regression = useMemo(() => {
    if (scatterData.length < 2) {
      console.log('[DEBUG] 8. Regression: null (need ≥2 points, have ' + scatterData.length + ')');
      return null;
    }
    const xVals = scatterData.map(p => p.x);
    const yVals = scatterData.map(p => p.y);
    const result = calculateRegression(xVals, yVals);
    console.log('[DEBUG] 8. Calculated R Value:', result.r, '| R²:', result.r2, '| Slope:', result.m, '| n:', result.n);
    return result;
  }, [scatterData]);

  const chartData = useMemo(() => {
    if (scatterData.length === 0) return [];
    const withTrend = scatterData.map(p => ({
      ...p,
      trendY: regression ? regression.m * p.x + regression.b : null
    }));
    withTrend.sort((a, b) => a.x - b.x);
    return withTrend;
  }, [scatterData, regression]);

  const correlationStrength = regression ? getCorrelationStrength(regression.r) : null;

  if (loading) return <div className="pt-32 text-center text-primary-accent italic">Analyzing Data...</div>;

  const getBarData = () => {
    if (!analysisData?.descriptive) return [];
    return Object.keys(analysisData.descriptive).map(key => ({
      name: key.replace('_', ' '),
      mean: analysisData.descriptive[key]?.mean ?? 0
    }));
  };

  const availableVariables = NUMERIC_FIELDS;

  return (
    <div className="space-y-6 md:space-y-8 pb-8 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Data Visualizations</h2>
        {loading ? (
          <p className="text-xs sm:text-sm text-primary-accent italic">Loading...</p>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-[10px] sm:text-xs text-white/40 flex-shrink-0">Dataset:</span>
            <select
              value={selectedDataset ?? ''}
              onChange={(e) => handleDatasetSelect(e.target.value)}
              className="flex-1 sm:flex-none bg-[rgba(20,20,20,0.75)] backdrop-blur-lg border border-white/15 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer min-w-0 max-w-full"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}
            >
              {Array.isArray(datasets) && datasets.map(ds => (
                <option key={ds.id} value={ds.id} className="bg-[#111827] text-white">{ds.dataset_name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="glass-card border-red-400/20 bg-red-400/5 py-6 px-8 flex items-center gap-4">
          <AlertCircle size={20} className="text-red-400/60" />
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      )}

      {!analysisData ? (
        <div className="glass-card py-20 text-center">
          <p className="text-secondary-accent italic">Upload a dataset to see visualizations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Mean Values Bar Chart */}
          <div className="glass-card p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="text-primary-accent" size={20} />
              <h3 className="text-lg">Average Metrics</h3>
            </div>
            <div className="h-80 w-full" style={{ minHeight: '320px' }}>
              {getBarData().length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
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

          {/* Productivity Correlation Scatter Plot */}
          <div className="glass-card p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="text-primary-accent" size={20} />
              <h3 className="text-lg">Productivity Correlation</h3>
            </div>

            {/* Variable Selectors */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">X:</span>
                <select
                  value={xVariable}
                  onChange={(e) => setXVariable(e.target.value)}
                  className="bg-[rgba(20,20,20,0.75)] border border-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white focus:outline-none focus:border-white/30"
                >
                  {availableVariables.filter(v => v !== yVariable).map(v => (
                    <option key={v} value={v} className="bg-[#111827] text-white">{formatFieldName(v)}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">Y:</span>
                <select
                  value={yVariable}
                  onChange={(e) => setYVariable(e.target.value)}
                  className="bg-[rgba(20,20,20,0.75)] border border-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white focus:outline-none focus:border-white/30"
                >
                  {availableVariables.filter(v => v !== xVariable).map(v => (
                    <option key={v} value={v} className="bg-[#111827] text-white">{formatFieldName(v)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dataset Info Bar */}
            {analysisData && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 sm:mb-4 bg-white/5 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">
                <span className="text-white/30 whitespace-nowrap">
                  Records: <span className="text-white/60">{datasetRecords.length}</span>
                </span>
                <span className="text-white/30 whitespace-nowrap">
                  Valid: <span className="text-white/60">{scatterData.length}</span>
                </span>
                <span className="text-white/30 whitespace-nowrap">
                  X: <span className="text-white/60">{formatFieldName(xVariable)}</span>
                </span>
                <span className="text-white/30 whitespace-nowrap">
                  Y: <span className="text-white/60">{formatFieldName(yVariable)}</span>
                </span>
              </div>
            )}

            {/* Scatter Plot */}
            <div className="h-72 w-full" style={{ minHeight: '288px' }}>
              {chartData.length >= 2 && regression ? (
                <ResponsiveContainer width="100%" height={288}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis
                      dataKey="x"
                      stroke="#9CA3AF"
                      fontSize={10}
                      label={{ value: formatFieldName(xVariable), position: 'insideBottom', offset: -5, style: { fill: '#9CA3AF', fontSize: 10 } }}
                      type="number"
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={10}
                      label={{ value: formatFieldName(yVariable), angle: -90, position: 'insideLeft', offset: 0, style: { fill: '#9CA3AF', fontSize: 10 } }}
                      type="number"
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#FFFFFF' }}
                      formatter={(value, name) => {
                        if (name === 'trendY') return null;
                        return [Number(value).toFixed(2), name === 'y' ? formatFieldName(yVariable) : formatFieldName(xVariable)];
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          const d = payload[0].payload;
                          return `${formatFieldName(xVariable)}: ${Number(d.x).toFixed(2)}, ${formatFieldName(yVariable)}: ${Number(d.y).toFixed(2)}`;
                        }
                        return '';
                      }}
                    />
                    <Scatter
                      dataKey="y"
                      fill="#FFFFFF"
                      fillOpacity={0.6}
                      stroke="none"
                    />
                    <Line
                      dataKey="trendY"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                      legendType="none"
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/30 italic gap-2">
                  {scatterData.length === 0 && datasetRecords.length === 0 ? (
                    <span>No records found in this dataset.</span>
                  ) : scatterData.length === 0 && datasetRecords.length > 0 ? (
                    <span>No valid numeric data available for correlation analysis. All {datasetRecords.length} records contain non-numeric values for the selected variables.</span>
                  ) : scatterData.length === 1 ? (
                    <>
                      <span>Correlation requires at least 2 valid observations.</span>
                      <span className="text-white/20 text-xs">Current dataset contains only 1 valid observation. Add more records to enable correlation analysis.</span>
                    </>
                  ) : (
                    <span>Insufficient data (need at least 2 points) for correlation</span>
                  )}
                </div>
              )}
            </div>

            {/* Statistics Display */}
            {regression && (
              <div className="mt-6 bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">Correlation Analysis</span>
                  {correlationStrength && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${correlationStrength.color}20`, color: correlationStrength.color }}
                    >
                      {correlationStrength.label}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/30 block">R</span>
                    <span className="text-base sm:text-lg font-semibold text-white break-all">{regression.r.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/30 block">R²</span>
                    <span className="text-base sm:text-lg font-semibold text-white break-all">{regression.r2.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/30 block">Obs</span>
                    <span className="text-base sm:text-lg font-semibold text-white">{regression.n}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/30 block">Slope</span>
                    <span className="text-base sm:text-lg font-semibold text-white break-all">{regression.m.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/30 block">Intercept</span>
                    <span className="text-base sm:text-lg font-semibold text-white break-all">{regression.b.toFixed(4)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-white/50 leading-relaxed">
                    {correlationStrength && (
                      <>
                        There is a <span style={{ color: correlationStrength.color }} className="font-semibold">{correlationStrength.label.toLowerCase()}</span>
                        {' '}{regression.r >= 0 ? 'positive' : 'negative'} correlation (r = {regression.r.toFixed(3)})
                        {' '}between <span className="text-white/80">{formatFieldName(xVariable)}</span> and{' '}
                        <span className="text-white/80">{formatFieldName(yVariable)}</span>.
                        {regression.r2 >= 0.5
                          ? ` ${formatFieldName(xVariable)} explains ${(regression.r2 * 100).toFixed(1)}% of the variance in ${formatFieldName(yVariable)}.`
                          : ''}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <div className="glass-card lg:col-span-2 p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Activity className="text-primary-accent" size={20} />
              <h3 className="text-lg">AI Insights & Interpretations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="space-y-3 sm:space-y-4">
                {(analysisData.insights && Array.isArray(analysisData.insights) ? analysisData.insights : []).map((c, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary-accent" />
                    <p className="text-sm text-secondary-accent leading-relaxed">{c}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-primary-accent/5 rounded-2xl border border-primary-accent/10">
                <h4 className="text-primary-accent font-bold mb-2 uppercase text-[10px] sm:text-xs tracking-widest">Key Probability</h4>
                <p className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
                  {analysisData.probabilities?.highProductivity != null ? (analysisData.probabilities.highProductivity * 100).toFixed(1) : "N/A"}%
                </p>
                <p className="text-secondary-accent text-xs sm:text-sm italic">
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