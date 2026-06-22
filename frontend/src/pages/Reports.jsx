import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Calendar, File } from 'lucide-react';
import { reportAPI, datasetAPI } from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchDatasets();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchDatasets = async () => {
    try {
      const response = await datasetAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
      setDatasets(data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const triggerDownload = (response, filename) => {
    const contentType = response.headers?.['content-type'] || '';
    const blob = new Blob([response.data], {
      type: contentType.includes('pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = async (datasetId) => {
    setGenerating(datasetId);
    try {
      const response = await reportAPI.generatePDF(datasetId);
      triggerDownload(response, `Dataset_Report_${datasetId}.pdf`);
      fetchReports();
    } catch (error) {
      console.error('Error generating PDF:', error);
      const msg = error.response?.data?.error || error.message || 'Failed to generate PDF';
      alert(`PDF generation failed: ${msg}`);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateExcel = async (datasetId) => {
    setGenerating(datasetId);
    try {
      const response = await reportAPI.generateExcel(datasetId);
      triggerDownload(response, `Dataset_Report_${datasetId}.xlsx`);
      fetchReports();
    } catch (error) {
      console.error('Error generating Excel:', error);
      const msg = error.response?.data?.error || error.message || 'Failed to generate Excel';
      alert(`Excel generation failed: ${msg}`);
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = async (reportId, fileName) => {
    try {
      const response = await reportAPI.download(reportId);
      triggerDownload(response, fileName || 'report');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Generated Reports</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <AnimatePresence>
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card flex items-center justify-between group p-4 sm:p-5 md:p-6 lg:p-8"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="p-2 sm:p-3 bg-white/5 rounded-xl text-primary-accent flex-shrink-0">
                    {report.report_path?.endsWith('.pdf') ? <FileText size={20} /> : <File size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{report.report_path?.split('\\').pop()?.split('-').pop() || 'Report'}</h3>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-secondary-accent">
                      <span className="flex items-center space-x-1">
                        <Calendar size={10} />
                        <span className="truncate">{report.generated_at ? new Date(report.generated_at).toLocaleDateString() : 'Unknown date'}</span>
                      </span>
                      <span>•</span>
                      <span>{report.report_path?.split('.').pop()?.toUpperCase() || 'FILE'}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownload(report.id, report.report_path?.split('\\').pop() || 'report')}
                  className="p-2 sm:p-3 hover:bg-primary-accent hover:text-background rounded-full transition-all flex-shrink-0 ml-3"
                >
                  <Download size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {reports.length === 0 && (
            <div className="py-16 sm:py-20 text-center glass-card border-dashed">
              <FileText className="mx-auto text-secondary-accent/20 mb-4" size={36} />
              <p className="text-secondary-accent italic text-sm sm:text-base">No reports generated yet.</p>
            </div>
          )}
        </div>

        {/* Generate New Report Panel */}
        <div className="space-y-4 sm:space-y-6">
          <div className="glass-card p-5 sm:p-6 md:p-8">
            <h3 className="text-base sm:text-lg mb-3 sm:mb-4">Quick Actions</h3>
            <p className="text-xs sm:text-sm text-secondary-accent mb-4 sm:mb-6 leading-relaxed">
              Select a dataset to generate a comprehensive research report in PDF or Excel format.
            </p>
            <div className="space-y-2 sm:space-y-3">
              {datasets.map(ds => (
                <div key={ds.id} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col space-y-2 sm:space-y-3">
                  <span className="text-xs sm:text-sm font-medium truncate">{ds.dataset_name}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleGeneratePDF(ds.id)}
                      disabled={generating === ds.id}
                      className="flex-1 text-[9px] sm:text-[10px] bg-primary-accent text-background font-bold py-1.5 sm:py-2 rounded-lg uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                    >
                      {generating === ds.id ? 'Generating...' : 'PDF Report'}
                    </button>
                    <button 
                      onClick={() => handleGenerateExcel(ds.id)}
                      disabled={generating === ds.id}
                      className="flex-1 text-[9px] sm:text-[10px] bg-white/10 text-primary-accent font-bold py-1.5 sm:py-2 rounded-lg uppercase tracking-wider hover:bg-white/20 disabled:opacity-50"
                    >
                      {generating === ds.id ? 'Generating...' : 'Excel Export'}
                    </button>
                  </div>
                </div>
              ))}
              {datasets.length === 0 && (
                <p className="text-[11px] sm:text-xs text-secondary-accent italic text-center">No datasets available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
