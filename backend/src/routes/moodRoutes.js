const express = require('express');
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Project mood routes
router.post('/projects/:id/mood', moodController.submitMood);
router.get('/projects/:id/mood', moodController.getProjectMood);
router.get('/projects/:id/mood/user', moodController.getUserMoodHistory);

module.exports = router;