const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Task routes
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/assign', taskController.assignTask);
router.delete('/:id/assign/:assigneeId', taskController.unassignTask);
router.post('/:id/comments', taskController.addComment);
router.get('/:id/comments', taskController.getTaskComments);

module.exports = router;