const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.signup);
router.post('/signup', authController.signup); // Keep this for backward compatibility
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);
router.post('/change-password', authMiddleware.authenticate, authController.changePassword);

module.exports = router;