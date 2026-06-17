import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Database, Trash2, FileText, Plus, X } from 'lucide-react';
import { datasetAPI } from '../services/api';

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState('file'); // 'file' or 'manual'
  const [uploadFile, setUploadFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [manualRecords, setManualRecords] = useState([
    { screen_time: '', social_media_usage: '', study_time: '', sleep_duration: '', device_type: 'Smartphone', apps_used: '', productivity_score: '' }
  ]);

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

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setFormError('');
    setFormSuccess('');

    try {
      if (uploadTab === 'file') {
        if (!uploadFile) {
          setFormError('Please select a file to upload.');
          setIsUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('dataset_name', datasetName || uploadFile.name);
        await datasetAPI.upload(formData);
      } else {
        // Validation
        const validRecords = manualRecords.filter(r => r.productivity_score !== '');
        if (validRecords.length === 0) {
          setFormError('Please enter at least one record with a productivity score.');
          setIsUploading(false);
          return;
        }
        await datasetAPI.manual({ 
          dataset_name: datasetName || 'Manual Entry ' + new Date().toLocaleDateString(),
          records: validRecords 
        });
      }

      setFormSuccess('Dataset successfully saved to your research hub.');
      
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setDatasetName('');
        setFormSuccess('');
        setManualRecords([{ screen_time: '', social_media_usage: '', study_time: '', sleep_duration: '', device_type: 'Smartphone', apps_used: '', productivity_score: '' }]);
        fetchDatasets();
      }, 2000);

    } catch (error) {
      console.error('Dataset Upload Error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'An unexpected error occurred';
      setFormError(`Operation failed: ${errorMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const addManualRow = () => {
    setManualRecords([...manualRecords, { screen_time: '', social_media_usage: '', study_time: '', sleep_duration: '', device_type: 'Smartphone', apps_used: '', productivity_score: '' }]);
  };

  const updateManualRecord = (index, field, value) => {
    const updated = [...manualRecords];
    updated[index][field] = value;
    setManualRecords(updated);
  };

  const removeManualRow = (index) => {
    if (manualRecords.length === 1) return;
    setManualRecords(manualRecords.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;
    try {
      await datasetAPI.delete(id);
      fetchDatasets();
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Research Datasets</h2>
          <p className="text-sm text-white/40">Manage and upload your technology usage data for analysis.</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-3 px-8 py-4 text-[12px] font-bold uppercase tracking-widest"
        >
          <Plus size={18} />
          <span>Upload New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {datasets.map((ds) => (
            <motion.div
              key={ds.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card group relative bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 rounded-[2.5rem] p-8"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <Database className="text-white/60" size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(ds.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="text-xl font-serif text-white mb-1 truncate">{ds.dataset_name}</h3>
              <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-6">
                Added {new Date(ds.upload_date).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                  {ds.file_path ? ds.file_path.split('.').pop() : 'MANUAL'}
                </span>
                <Link to="/dashboard/analysis" className="text-[10px] font-bold uppercase tracking-widest text-primary-accent hover:underline">
                  Analyze Data
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {datasets.length === 0 && (
          <div className="col-span-full py-32 text-center glass-card bg-white/5 border-dashed border-white/10 rounded-[3rem]">
            <Database className="mx-auto text-white/10 mb-6" size={64} />
            <p className="text-white/30 font-serif italic text-xl">Your research repository is empty.</p>
            <p className="text-white/20 text-sm mt-2">Start by uploading a CSV or entering data manually.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif text-white mb-1">Upload Dataset</h3>
                <p className="text-sm text-white/40">Choose your preferred method of data entry.</p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-3 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex border-b border-white/5">
              <button 
                onClick={() => setUploadTab('file')}
                className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${uploadTab === 'file' ? 'bg-white/5 text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                File Upload
              </button>
              <button 
                onClick={() => setUploadTab('manual')}
                className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${uploadTab === 'manual' ? 'bg-white/5 text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Manual Entry
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <form onSubmit={handleUpload} className="space-y-10">
                {/* Feedback Messages */}
                <AnimatePresence>
                  {formError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-400/10 border border-red-400/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-light flex items-center gap-3"
                    >
                      <X size={18} />
                      {formError}
                    </motion.div>
                  )}
                  {formSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-400/10 border border-green-400/20 text-green-400 px-6 py-4 rounded-2xl text-sm font-light flex items-center gap-3"
                    >
                      <CheckCircle2 size={18} />
                      {formSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Dataset Name</label>
                  <input 
                    type="text" 
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="e.g. Student Productivity Hub - Q1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>

                {uploadTab === 'file' ? (
                  <div className="space-y-6">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Select Research File (CSV/XLSX)</label>
                    <div className="relative border-2 border-dashed border-white/5 rounded-3xl p-16 text-center hover:border-white/20 hover:bg-white/[0.01] transition-all cursor-pointer group">
                      <input 
                        type="file" 
                        accept=".csv, .xlsx, .xls"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Upload className="text-white/40" size={32} />
                      </div>
                      <p className="text-lg font-serif text-white mb-2">
                        {uploadFile ? uploadFile.name : 'Click or drag file to upload'}
                      </p>
                      <p className="text-sm text-white/20 font-light">Max file size: 10MB. Supports .csv, .xlsx, .xls</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Enter Data Records</label>
                      <button 
                        type="button"
                        onClick={addManualRow}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-accent hover:underline"
                      >
                        <Plus size={14} /> Add Row
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                      <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                          <tr className="text-[10px] font-bold uppercase tracking-widest text-white/20 text-left">
                            <th className="px-4 py-3">Screen Time</th>
                            <th className="px-4 py-3">Social Media</th>
                            <th className="px-4 py-3">Study Time</th>
                            <th className="px-4 py-3">Sleep</th>
                            <th className="px-4 py-3">Device</th>
                            <th className="px-4 py-3">Apps</th>
                            <th className="px-4 py-3">Score (1-10)</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {manualRecords.map((record, index) => (
                            <tr key={index} className="group">
                              <td className="p-2">
                                <input 
                                  type="number" step="0.1"
                                  value={record.screen_time}
                                  onChange={(e) => updateManualRecord(index, 'screen_time', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                              </td>
                              <td className="p-2">
                                <input 
                                  type="number" step="0.1"
                                  value={record.social_media_usage}
                                  onChange={(e) => updateManualRecord(index, 'social_media_usage', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                              </td>
                              <td className="p-2">
                                <input 
                                  type="number" step="0.1"
                                  value={record.study_time}
                                  onChange={(e) => updateManualRecord(index, 'study_time', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                              </td>
                              <td className="p-2">
                                <input 
                                  type="number" step="0.1"
                                  value={record.sleep_duration}
                                  onChange={(e) => updateManualRecord(index, 'sleep_duration', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                              </td>
                              <td className="p-2">
                                <select 
                                  value={record.device_type}
                                  onChange={(e) => updateManualRecord(index, 'device_type', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                >
                                  <option className="bg-[#0a0a0a]">Smartphone</option>
                                  <option className="bg-[#0a0a0a]">Laptop</option>
                                  <option className="bg-[#0a0a0a]">Tablet</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <input 
                                  type="number"
                                  value={record.apps_used}
                                  onChange={(e) => updateManualRecord(index, 'apps_used', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                              </td>
                              <td className="p-2">
                                <input 
                                  type="number" max="10" min="1"
                                  value={record.productivity_score}
                                  onChange={(e) => updateManualRecord(index, 'productivity_score', e.target.value)}
                                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                />
                              </td>
                              <td className="p-2">
                                <button 
                                  type="button"
                                  onClick={() => removeManualRow(index)}
                                  className="p-2 text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-[11px] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUploading || (uploadTab === 'file' && !uploadFile)}
                    className="flex-[2] btn-primary py-4 disabled:opacity-40 font-bold uppercase tracking-widest text-[11px] transition-all"
                  >
                    {isUploading ? 'Processing...' : 'Complete Upload'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Datasets;
