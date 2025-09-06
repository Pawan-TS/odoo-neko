const express = require('express');
const dependencyController = require('../controllers/dependencyController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Task dependency routes
router.post('/tasks/:id/dependencies', dependencyController.addDependency);
router.get('/tasks/:id/dependencies', dependencyController.listDependencies);
router.put('/tasks/:id/dependencies/:depId', dependencyController.resolveDependency);
router.delete('/tasks/:id/dependencies/:depId', dependencyController.deleteDependency);

module.exports = router;