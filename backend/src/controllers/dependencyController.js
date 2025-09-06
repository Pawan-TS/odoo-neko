const TaskDependency = require('../models/TaskDependency');
const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');
const dependencyService = require('../services/dependencyService');

// Add dependency
exports.addDependency = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const { blockedBy } = req.body;
    
    // Validate input
    if (!blockedBy) {
      return res.status(400).json({ message: 'Blocking task ID is required' });
    }
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get blocking task
    const blockingTask = await Task.findById(blockedBy);
    if (!blockingTask) {
      return res.status(404).json({ message: 'Blocking task not found' });
    }
    
    // Check if tasks are in the same project
    if (task.project_id !== blockingTask.project_id) {
      return res.status(400).json({ message: 'Tasks must be in the same project' });
    }
    
    // Check if user is member of project
    const isMember = await ProjectMember.isMember(task.project_id, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Add dependency
    try {
      const dependencyId = await TaskDependency.addDependency(taskId, blockedBy);
      
      // Get dependency details
      const dependency = await dependencyService.getDependencyDetails(dependencyId);
      
      res.status(201).json({ 
        message: 'Dependency added successfully',
        dependency 
      });
    } catch (error) {
      // Handle specific errors
      if (error.message.includes('Circular dependency')) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error adding dependency:', error);
    res.status(500).json({ message: 'An error occurred while adding the dependency' });
  }
};

// List dependencies
exports.listDependencies = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const isMember = await ProjectMember.isMember(task.project_id, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Get dependencies
    const dependencies = await TaskDependency.getDependencies(taskId);
    
    // Get dependent tasks
    const dependentTasks = await TaskDependency.getDependentTasks(taskId);
    
    // Enhance with additional details
    const enhancedDependencies = await dependencyService.enhanceDependencyData(dependencies);
    const enhancedDependentTasks = await dependencyService.enhanceDependencyData(dependentTasks);
    
    res.status(200).json({ 
      blockedBy: enhancedDependencies,
      blocks: enhancedDependentTasks,
      isBlocked: enhancedDependencies.some(dep => dep.status === 'blocked')
    });
  } catch (error) {
    console.error('Error listing dependencies:', error);
    res.status(500).json({ message: 'An error occurred while fetching dependencies' });
  }
};

// Resolve dependency
exports.resolveDependency = async (req, res) => {
  try {
    const taskId = req.params.id;
    const dependencyId = req.params.depId;
    const userId = req.user.userId;
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const isMember = await ProjectMember.isMember(task.project_id, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Resolve dependency
    const resolved = await TaskDependency.resolveDependency(dependencyId);
    if (!resolved) {
      return res.status(404).json({ message: 'Dependency not found' });
    }
    
    res.status(200).json({ message: 'Dependency resolved successfully' });
  } catch (error) {
    console.error('Error resolving dependency:', error);
    res.status(500).json({ message: 'An error occurred while resolving the dependency' });
  }
};

// Delete dependency
exports.deleteDependency = async (req, res) => {
  try {
    const taskId = req.params.id;
    const dependencyId = req.params.depId;
    const userId = req.user.userId;
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const isAdmin = await ProjectMember.isOwnerOrAdmin(task.project_id, userId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to delete dependencies' });
    }
    
    // Delete dependency
    const deleted = await TaskDependency.deleteDependency(dependencyId);
    if (!deleted) {
      return res.status(404).json({ message: 'Dependency not found' });
    }
    
    res.status(200).json({ message: 'Dependency deleted successfully' });
  } catch (error) {
    console.error('Error deleting dependency:', error);
    res.status(500).json({ message: 'An error occurred while deleting the dependency' });
  }
};