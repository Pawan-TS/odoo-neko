const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// User routes
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.get('/:id/tasks', userController.getUserTasks);

module.exports = router;