const express = require('express');
const AdminController = require('../controllers/AdminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getAllUsers);
router.get('/logs', AdminController.getActivityLogs);

module.exports = router;
