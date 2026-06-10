const express = require('express');
const DatasetController = require('../controllers/DatasetController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

const router = express.Router();

// Public/Guest route (optional if we want guests to upload without login)
// Actually, let's allow guests but with limited persistence (not saving user_id)
router.post('/upload/guest', upload.single('file'), DatasetController.upload);
router.post('/manual/guest', DatasetController.manualEntry);

// Protected routes
router.post('/upload', authMiddleware, upload.single('file'), DatasetController.upload);
router.post('/manual', authMiddleware, DatasetController.manualEntry);
router.get('/', authMiddleware, DatasetController.getAll);
router.get('/:id', authMiddleware, DatasetController.getById);
router.delete('/:id', authMiddleware, DatasetController.delete);

module.exports = router;
