const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Project routes
router.post('/', projectController.createProject);
router.get('/', projectController.getUserProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.patch('/:id', projectController.updateProject); // Add support for PATCH method
router.delete('/:id', projectController.deleteProject);

// Project members
router.post('/:id/members', projectController.addProjectMember);
router.get('/:id/members/:memberId', projectController.getProjectMember);
router.delete('/:id/members/:memberId', projectController.removeProjectMember);

// Project tasks
const taskController = require('../controllers/taskController');
router.post('/:id/tasks', taskController.createTask);
router.get('/:id/tasks', taskController.getProjectTasks);

module.exports = router;