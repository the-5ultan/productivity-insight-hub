import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Database, Trash2, FileText, Plus, X } from 'lucide-react';
import { datasetAPI } from '../services/api';

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');

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
    if (!uploadFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('dataset_name', datasetName || uploadFile.name);

    try {
      await datasetAPI.upload(formData);
      setShowUploadModal(false);
      setUploadFile(null);
      setDatasetName('');
      fetchDatasets();
    } catch (error) {
      alert('Upload failed: ' + error.response?.data?.error || error.message);
    } finally {
      setIsUploading(false);
    }
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
        <h2 className="text-2xl font-bold">Your Datasets</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-2 px-4 py-2"
        >
          <Plus size={18} />
          <span>Upload New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {datasets.map((ds) => (
            <motion.div
              key={ds.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card group relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-accent/10 rounded-xl">
                  <Database className="text-primary-accent" size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(ds.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-secondary-accent hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="text-lg font-semibold mb-1 truncate">{ds.dataset_name}</h3>
              <p className="text-secondary-accent text-xs mb-4">
                Uploaded on {new Date(ds.upload_date).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-4 text-xs font-medium text-primary-accent">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 uppercase">
                  {ds.file_path?.split('.').pop() || 'MANUAL'}
                </span>
                <span className="text-secondary-accent">|</span>
                <button className="hover:underline">View Records</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {datasets.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card border-dashed">
            <Database className="mx-auto text-secondary-accent/20 mb-4" size={48} />
            <p className="text-secondary-accent italic">No datasets found. Start by uploading one.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-8 relative"
          >
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-secondary-accent hover:text-primary-accent"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl mb-6">Upload Dataset</h3>
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Dataset Name (Optional)</label>
                <input 
                  type="text" 
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g. My Study Habits"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select File (CSV, XLSX)</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary-accent/50 transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    accept=".csv, .xlsx, .xls"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto text-secondary-accent mb-2" size={32} />
                  <p className="text-sm text-secondary-accent">
                    {uploadFile ? uploadFile.name : 'Click or drag file here'}
                  </p>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isUploading || !uploadFile}
                className="btn-primary w-full py-4 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Start Upload'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Datasets;
