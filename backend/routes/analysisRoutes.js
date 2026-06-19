const express = require('express');
const AnalysisController = require('../controllers/AnalysisController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (for guests)
router.get('/analyze/guest/:datasetId', (req, res) => AnalysisController.analyze(req, res));
router.post('/predict', (req, res) => AnalysisController.predict(req, res));

// Protected routes
router.get('/analyze/:datasetId', authMiddleware, (req, res) => AnalysisController.analyze(req, res));
router.post('/run', authMiddleware, (req, res) => {
  console.log("Analysis request received");
  AnalysisController.analyze(req, res);
});
router.post('/compare', authMiddleware, (req, res) => AnalysisController.compare(req, res));
router.post('/compare-multi', authMiddleware, (req, res) => AnalysisController.compareMulti(req, res));

module.exports = router;
