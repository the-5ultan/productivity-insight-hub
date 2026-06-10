const AnalysisService = require('../services/AnalysisService');

class AnalysisController {
  async analyze(req, res) {
    try {
      const { datasetId } = req.params;
      const user_id = req.user ? req.user.id : null;
      const result = await AnalysisService.analyzeDataset(datasetId, user_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async compare(req, res) {
    try {
      const { datasetIdA, datasetIdB } = req.body;
      const result = await AnalysisService.compareDatasets(datasetIdA, datasetIdB);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async predict(req, res) {
    try {
      const prediction = await AnalysisService.predictProductivity(req.body);
      res.json({ predicted_score: prediction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AnalysisController();
