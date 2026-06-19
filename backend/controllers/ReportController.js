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
      const reportData = await this.buildReportData(datasetId, user_id);
      const report = await ReportService.generatePDF(reportData);
      const absolutePath = path.resolve(report.report_path);
      res.download(absolutePath, `Dataset_Report_${datasetId}.pdf`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateExcel(req, res) {
    try {
      const { datasetId } = req.params;
      const user_id = req.user.id;
      const reportData = await this.buildReportData(datasetId, user_id);
      const report = await ReportService.generateExcel(reportData);
      const absolutePath = path.resolve(report.report_path);
      res.download(absolutePath, `Dataset_Report_${datasetId}.xlsx`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buildReportData(datasetId, userId) {
    const { stats } = await AnalysisService.analyzeDataset(datasetId, userId);
    const dataset = await DatasetService.getDatasetWithRecords(datasetId);

    const records = dataset.DatasetRecords || [];
    const rawRecords = records.map(r => r.dataValues || r);

    const { descriptive, correlationMatrix, probabilities, insights, problemIdentification, impactAnalysis, advancedAnalysis } = stats;

    const summary = this.generateSummary(descriptive, correlationMatrix, advancedAnalysis, insights);

    return {
      userId,
      dataset: {
        id: datasetId,
        name: dataset.dataset_name,
        uploadDate: dataset.upload_date,
        recordCount: rawRecords.length,
        analysisType: 'Comprehensive Statistical Analysis'
      },
      rawRecords,
      statistics: descriptive,
      correlationMatrix,
      probabilities,
      regression: advancedAnalysis?.regression || null,
      weightedIndex: advancedAnalysis?.weightedIndex || null,
      mcda: advancedAnalysis?.mcda || null,
      insights,
      impactAnalysis,
      problemIdentification,
      summary,
      generatedAt: new Date().toISOString()
    };
  }

  generateSummary(descriptive, correlationMatrix, advancedAnalysis, insights) {
    const parts = [];
    if (descriptive && descriptive.productivity_score) {
      const avg = descriptive.productivity_score.mean;
      parts.push(`The dataset shows an average productivity score of ${avg != null ? avg.toFixed(2) : 'N/A'}.`);
    }
    if (correlationMatrix && correlationMatrix.productivity_score) {
      const corr = correlationMatrix.productivity_score;
      let strongest = { field: '', val: 0 };
      for (const field in corr) {
        if (field === 'productivity_score') continue;
        if (Math.abs(corr[field]) > Math.abs(strongest.val)) {
          strongest = { field, val: corr[field] };
        }
      }
      if (strongest.field) {
        const dir = strongest.val > 0 ? 'positive' : 'negative';
        parts.push(`The strongest relationship identified is between ${this.formatFieldName(strongest.field)} and productivity (${dir} correlation of ${strongest.val.toFixed(2)}).`);
      }
    }
    if (advancedAnalysis && advancedAnalysis.regression) {
      parts.push(`Regression analysis yields the equation: ${advancedAnalysis.regression.equation}.`);
    }
    if (insights && insights.length > 0) {
      parts.push(insights[0]);
    }
    return parts.length > 0 ? parts.join(' ') : 'Comprehensive analysis completed.';
  }

  formatFieldName(field) {
    return field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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