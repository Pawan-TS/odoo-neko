const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');

// Enhance workload data with additional metrics
exports.enhanceWorkloadData = async (workloadData, projectId) => {
  try {
    // Get total tasks in project
    const tasks = await Task.findByProjectId(projectId);
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    
    // Calculate project-wide metrics
    const projectMetrics = {
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      completionRate: totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0
    };
    
    // Get all project members
    const members = await ProjectMember.getProjectMembers(projectId);
    const memberMap = {};
    members.forEach(m => {
      memberMap[m.user_id] = {
        name: m.name,
        email: m.email,
        role: m.role
      };
    });
    
    // Enhance workload data with member info and metrics
    const enhancedWorkload = workloadData.map(w => {
      const memberInfo = memberMap[w.user_id] || {};
      const memberMetrics = {
        workloadPercentage: totalTasks > 0 ? (w.task_count / totalTasks) * 100 : 0,
        estimatedHoursPerTask: w.task_count > 0 ? w.estimated_hours / w.task_count : 0
      };
      
      return {
        ...w,
        ...memberInfo,
        metrics: memberMetrics
      };
    });
    
    return {
      projectMetrics,
      memberWorkloads: enhancedWorkload
    };
  } catch (error) {
    console.error('Error enhancing workload data:', error);
    throw error;
  }
};

// Calculate optimal workload distribution
exports.calculateOptimalDistribution = async (projectId) => {
  try {
    // Get all project members
    const members = await ProjectMember.getProjectMembers(projectId);
    if (!members.length) return [];
    
    // Get all tasks
    const tasks = await Task.findByProjectId(projectId, { status: 'todo' });
    if (!tasks.length) return [];
    
    // Simple algorithm to distribute tasks evenly
    // In a real app, this would be much more sophisticated
    const memberIds = members.map(m => m.user_id);
    const distribution = {};
    
    // Initialize distribution
    memberIds.forEach(id => {
      distribution[id] = [];
    });
    
    // Sort tasks by due date (earliest first)
    const sortedTasks = [...tasks].sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    });
    
    // Distribute tasks to members
    sortedTasks.forEach((task, index) => {
      const targetMemberId = memberIds[index % memberIds.length];
      distribution[targetMemberId].push(task.task_id);
    });
    
    // Format result
    return Object.entries(distribution).map(([userId, taskIds]) => ({
      user_id: parseInt(userId),
      name: members.find(m => m.user_id == userId)?.name || 'Unknown',
      assigned_tasks: taskIds,
      task_count: taskIds.length
    }));
  } catch (error) {
    console.error('Error calculating optimal distribution:', error);
    throw error;
  }
};