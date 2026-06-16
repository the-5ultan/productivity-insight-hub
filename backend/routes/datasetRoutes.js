const express = require('express');
const DatasetController = require('../controllers/DatasetController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

const router = express.Router();

// Public/Guest routes
router.post('/upload/guest', upload.single('file'), (req, res) => DatasetController.upload(req, res));
router.post('/manual/guest', (req, res) => DatasetController.manualEntry(req, res));

// Protected routes
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => DatasetController.upload(req, res));
router.post('/manual', authMiddleware, (req, res) => DatasetController.manualEntry(req, res));
router.get('/', authMiddleware, (req, res) => DatasetController.getAll(req, res));
router.get('/:id', authMiddleware, (req, res) => DatasetController.getById(req, res));
router.delete('/:id', authMiddleware, (req, res) => DatasetController.delete(req, res));

module.exports = router;
