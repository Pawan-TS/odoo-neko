const Task = require('../models/Task');
const TaskDependency = require('../models/TaskDependency');

// Get detailed info for a dependency
exports.getDependencyDetails = async (dependencyId) => {
  try {
    // Get raw dependency
    const [rows] = await require('../config/db').pool.execute(
      `SELECT td.*, 
              t1.title as dependent_task_title, t1.status as dependent_task_status,
              t2.title as blocking_task_title, t2.status as blocking_task_status
       FROM task_dependency td
       JOIN tasks t1 ON td.task_id = t1.task_id
       JOIN tasks t2 ON td.blocked_by = t2.task_id
       WHERE td.dependency_id = ?`,
      [dependencyId]
    );
    
    if (!rows.length) return null;
    
    const dep = rows[0];
    
    return {
      dependency_id: dep.dependency_id,
      task_id: dep.task_id,
      blocked_by: dep.blocked_by,
      status: dep.status,
      dependent_task: {
        task_id: dep.task_id,
        title: dep.dependent_task_title,
        status: dep.dependent_task_status
      },
      blocking_task: {
        task_id: dep.blocked_by,
        title: dep.blocking_task_title,
        status: dep.blocking_task_status
      },
      is_resolved: dep.status === 'resolved',
      can_proceed: dep.status === 'resolved' || dep.blocking_task_status === 'done'
    };
  } catch (error) {
    console.error('Error getting dependency details:', error);
    throw error;
  }
};

// Enhance dependency data with related task details
exports.enhanceDependencyData = async (dependencies) => {
  try {
    if (!dependencies.length) return [];
    
    // Get task IDs
    const taskIds = new Set();
    dependencies.forEach(dep => {
      if (dep.task_id) taskIds.add(dep.task_id);
      if (dep.blocked_by) taskIds.add(dep.blocked_by);
    });
    
    // Get task details
    const tasks = {};
    for (const taskId of taskIds) {
      const task = await Task.findById(taskId);
      if (task) {
        tasks[taskId] = {
          task_id: task.task_id,
          title: task.title,
          status: task.status,
          due_date: task.due_date
        };
      }
    }
    
    // Enhance dependencies
    return dependencies.map(dep => ({
      ...dep,
      dependent_task: dep.task_id ? tasks[dep.task_id] : null,
      blocking_task: dep.blocked_by ? tasks[dep.blocked_by] : null,
      is_resolved: dep.status === 'resolved',
      can_proceed: dep.status === 'resolved' || 
                  (dep.blocked_by && tasks[dep.blocked_by]?.status === 'done')
    }));
  } catch (error) {
    console.error('Error enhancing dependency data:', error);
    throw error;
  }
};

// Analyze dependencies to detect circular paths
exports.detectCircularDependencies = async (projectId) => {
  try {
    // Get all tasks in the project
    const tasks = await Task.findByProjectId(projectId);
    const taskIds = tasks.map(t => t.task_id);
    
    // Build dependency graph
    const graph = {};
    for (const taskId of taskIds) {
      const dependencies = await TaskDependency.getDependencies(taskId);
      graph[taskId] = dependencies.map(d => d.blocked_by);
    }
    
    // Detect cycles using DFS
    const visited = new Set();
    const recursionStack = new Set();
    const circularPaths = [];
    
    const detectCycle = (taskId, path = []) => {
      if (recursionStack.has(taskId)) {
        // Found a cycle
        const cycleStart = path.findIndex(id => id === taskId);
        if (cycleStart >= 0) {
          circularPaths.push(path.slice(cycleStart).concat(taskId));
        }
        return;
      }
      
      if (visited.has(taskId)) return;
      
      visited.add(taskId);
      recursionStack.add(taskId);
      path.push(taskId);
      
      const dependencies = graph[taskId] || [];
      for (const depId of dependencies) {
        detectCycle(depId, [...path]);
      }
      
      recursionStack.delete(taskId);
    };
    
    // Run detection for each task
    for (const taskId of taskIds) {
      detectCycle(taskId);
    }
    
    // Format results
    return await Promise.all(circularPaths.map(async (path) => {
      const taskDetails = await Promise.all(path.map(async (id) => {
        const task = await Task.findById(id);
        return {
          task_id: id,
          title: task?.title || 'Unknown Task'
        };
      }));
      
      return {
        path: taskDetails,
        length: path.length
      };
    }));
  } catch (error) {
    console.error('Error detecting circular dependencies:', error);
    throw error;
  }
};