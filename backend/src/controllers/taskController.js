const Task = require('../models/Task');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const TaskAssignment = require('../models/TaskAssignment');
const Comment = require('../models/Comment');
const TaskDependency = require('../models/TaskDependency');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { title, description, status, dueDate } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member of project or has admin privileges
    const memberRecord = await ProjectMember.isMember(projectId, userId);
    const isOwnerOrAdmin = await ProjectMember.isOwnerOrAdmin(projectId, userId);
    
    if (!memberRecord && !isOwnerOrAdmin) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Create task
    const taskId = await Task.create(
      projectId, 
      title, 
      description || '', 
      status || 'todo',
      dueDate
    );
    
    // Get created task
    const task = await Task.findById(taskId);
    
    res.status(201).json({ 
      message: 'Task created successfully',
      task 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'An error occurred while creating the task' });
  }
};

// Get all tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { status, dueDate } = req.query;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member of project or has admin privileges
    const memberRecord = await ProjectMember.isMember(projectId, userId);
    const isOwnerOrAdmin = await ProjectMember.isOwnerOrAdmin(projectId, userId);
    
    if (!memberRecord && !isOwnerOrAdmin) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Get tasks with filters
    const tasks = await Task.findByProjectId(projectId, { status, dueDate });
    
    // Get task assignments
    const taskIds = tasks.map(task => task.task_id);
    const assignees = taskIds.length > 0 
      ? await TaskAssignment.getAssigneesForTasks(taskIds)
      : {};
    
    // Combine tasks with assignees
    const tasksWithAssignees = tasks.map(task => ({
      ...task,
      assignees: assignees[task.task_id] || []
    }));
    
    res.status(200).json({ tasks: tasksWithAssignees });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'An error occurred while fetching tasks' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const memberRecord = await ProjectMember.isMember(task.project_id, userId);
    if (!memberRecord) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Get task assignees
    const assignees = await TaskAssignment.getAssignments(taskId);
    
    // Get task comments
    const comments = await Comment.findByTaskId(taskId);
    
    // Get task dependencies
    const dependencies = await TaskDependency.getDependencies(taskId);
    const dependentTasks = await TaskDependency.getDependentTasks(taskId);
    
    res.status(200).json({ 
      task,
      assignees,
      comments,
      dependencies,
      dependentTasks
    });
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ message: 'An error occurred while fetching the task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const { title, description, status, dueDate } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const memberRecord = await ProjectMember.isMember(task.project_id, userId);
    if (!memberRecord) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Update task
    await Task.update(taskId, { 
      title, 
      description, 
      status: status || task.status, 
      dueDate: dueDate || task.due_date 
    });
    
    // If status changed to done, auto-resolve dependencies
    if (status === 'done' && task.status !== 'done') {
      await TaskDependency.autoResolveDependencies(taskId);
    }
    
    // Get updated task
    const updatedTask = await Task.findById(taskId);
    
    res.status(200).json({ 
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'An error occurred while updating the task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is admin/owner of project
    const isAdmin = await ProjectMember.isOwnerOrAdmin(task.project_id, userId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to delete this task' });
    }
    
    // Delete task
    await Task.delete(taskId);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'An error occurred while deleting the task' });
  }
};

// Assign task to user
exports.assignTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const { assigneeId } = req.body;
    
    // Validate input
    if (!assigneeId) {
      return res.status(400).json({ message: 'Assignee ID is required' });
    }
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const memberRecord = await ProjectMember.isMember(task.project_id, userId);
    if (!memberRecord) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Check if assignee is member of project
    const isAssigneeMember = await ProjectMember.isMember(task.project_id, assigneeId);
    if (!isAssigneeMember) {
      return res.status(400).json({ message: 'Assignee is not a member of this project' });
    }
    
    // Check if already assigned
    const isAssigned = await TaskAssignment.isAssigned(taskId, assigneeId);
    if (isAssigned) {
      return res.status(400).json({ message: 'User is already assigned to this task' });
    }
    
    // Assign task
    await TaskAssignment.assignTask(taskId, assigneeId);
    
    // Get assignee details
    const assignee = await require('../models/User').findById(assigneeId);
    
    res.status(200).json({ 
      message: 'Task assigned successfully',
      assignee: {
        user_id: assignee.user_id,
        name: assignee.name,
        email: assignee.email
      }
    });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'An error occurred while assigning the task' });
  }
};

// Unassign task from user
exports.unassignTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const assigneeId = req.params.assigneeId;
    const userId = req.user.userId;
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const memberRecord = await ProjectMember.isMember(task.project_id, userId);
    if (!memberRecord) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Check if assigned
    const isAssigned = await TaskAssignment.isAssigned(taskId, assigneeId);
    if (!isAssigned) {
      return res.status(400).json({ message: 'User is not assigned to this task' });
    }
    
    // Unassign task
    await TaskAssignment.removeAssignment(taskId, assigneeId);
    
    res.status(200).json({ message: 'Task unassigned successfully' });
  } catch (error) {
    console.error('Error unassigning task:', error);
    res.status(500).json({ message: 'An error occurred while unassigning the task' });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const { content } = req.body;
    
    // Validate input
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is member of project
    const memberRecord = await ProjectMember.isMember(task.project_id, userId);
    if (!memberRecord) {
      return res.status(403).json({ message: 'You do not have access to this task' });
    }
    
    // Add comment
    const commentId = await Comment.create(taskId, userId, content);
    
    // Get created comment
    const comment = await Comment.findById(commentId);
    
    res.status(201).json({ 
      message: 'Comment added successfully',
      comment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'An error occurred while adding the comment' });
  }
};

// Get comments for a task
exports.getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get comments for the task
    const comments = await Comment.findByTaskId(taskId);
    
    res.status(200).json({
      message: 'Comments retrieved successfully',
      comments
    });
  } catch (error) {
    console.error('Error retrieving task comments:', error);
    res.status(500).json({ message: 'An error occurred while retrieving task comments' });
  }
};
