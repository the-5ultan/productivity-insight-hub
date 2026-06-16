const express = require('express');
const ReportController = require('../controllers/ReportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pdf/:datasetId', authMiddleware, (req, res) => ReportController.generatePDF(req, res));
router.post('/excel/:datasetId', authMiddleware, (req, res) => ReportController.generateExcel(req, res));
router.get('/', authMiddleware, (req, res) => ReportController.getReports(req, res));
router.get('/download/:reportId', authMiddleware, (req, res) => ReportController.download(req, res));

module.exports = router;
