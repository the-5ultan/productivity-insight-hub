const express = require('express');
const ReportController = require('../controllers/ReportController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pdf/:datasetId', authMiddleware, ReportController.generatePDF);
router.post('/excel/:datasetId', authMiddleware, ReportController.generateExcel);
router.get('/', authMiddleware, ReportController.getReports);
router.get('/download/:reportId', authMiddleware, ReportController.download);

module.exports = router;
