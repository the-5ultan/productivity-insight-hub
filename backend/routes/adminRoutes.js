const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', adminController.getUsers);
router.get('/user/:id', adminController.getUserById);
router.get('/activity-logs', adminController.getActivityLogs);
router.get('/statistics', adminController.getStatistics);

module.exports = router;
