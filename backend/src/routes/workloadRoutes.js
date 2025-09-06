const express = require('express');
const workloadController = require('../controllers/workloadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Project workload routes
router.get('/projects/:id/workload', workloadController.getProjectWorkload);
router.post('/projects/:id/workload/rebalance', workloadController.suggestRebalance);
router.post('/projects/:id/workload/users/:userId/recalculate', workloadController.recalculateUserWorkload);

module.exports = router;