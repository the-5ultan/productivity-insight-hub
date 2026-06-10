const ReportService = require('../services/ReportService');
const AnalysisService = require('../services/AnalysisService');
const DatasetService = require('../services/DatasetService');
const path = require('path');
const fs = require('fs');

class ReportController {
  async generatePDF(req, res) {
    try {
      const { datasetId } = req.params;
      const user_id = req.user.id;
      const { stats } = await AnalysisService.analyzeDataset(datasetId, user_id);
      const dataset = await DatasetService.getDatasetWithRecords(datasetId);
      
      const report = await ReportService.generatePDF(stats, dataset.dataset_name, user_id);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateExcel(req, res) {
    try {
      const { datasetId } = req.params;
      const user_id = req.user.id;
      const dataset = await DatasetService.getDatasetWithRecords(datasetId);
      
      const report = await ReportService.generateExcel(dataset.DatasetRecords, dataset.dataset_name, user_id);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReports(req, res) {
    try {
      const reports = await ReportService.getUserReports(req.user.id);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async download(req, res) {
    try {
      const { reportId } = req.params;
      const { Report } = require('../models');
      const report = await Report.findByPk(reportId);
      
      if (!report) return res.status(404).json({ error: 'Report not found' });
      // Security: Check if user owns the report
      if (report.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

      const absolutePath = path.resolve(report.report_path);
      if (fs.existsSync(absolutePath)) {
        res.download(absolutePath);
      } else {
        res.status(404).json({ error: 'File not found on server' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReportController();
