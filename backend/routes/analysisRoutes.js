const express = require('express');
const AnalysisController = require('../controllers/AnalysisController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (for guests)
router.get('/analyze/guest/:datasetId', AnalysisController.analyze);
router.post('/predict', AnalysisController.predict);

// Protected routes
router.get('/analyze/:datasetId', authMiddleware, AnalysisController.analyze);
router.post('/compare', authMiddleware, AnalysisController.compare);

module.exports = router;
