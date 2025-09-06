const { pool } = require('../config/db');

class TaskDependency {
  // Add task dependency
  static async addDependency(taskId, blockedBy, status = 'blocked') {
    try {
      // Prevent circular dependencies
      if (taskId === blockedBy) {
        throw new Error('A task cannot depend on itself');
      }
      
      // Check if reverse dependency exists
      const [reverseCheck] = await pool.execute(
        'SELECT * FROM task_dependency WHERE task_id = ? AND blocked_by = ?',
        [blockedBy, taskId]
      );
      
      if (reverseCheck.length > 0) {
        throw new Error('Circular dependency detected');
      }
      
      const [result] = await pool.execute(
        'INSERT INTO task_dependency (task_id, blocked_by, status) VALUES (?, ?, ?)',
        [taskId, blockedBy, status]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get dependencies for a task
  static async getDependencies(taskId) {
    try {
      const [rows] = await pool.execute(
        `SELECT td.*, t.title, t.status as task_status
         FROM task_dependency td
         JOIN tasks t ON td.blocked_by = t.task_id
         WHERE td.task_id = ?`,
        [taskId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get tasks that depend on this task
  static async getDependentTasks(taskId) {
    try {
      const [rows] = await pool.execute(
        `SELECT td.*, t.title, t.status as task_status
         FROM task_dependency td
         JOIN tasks t ON td.task_id = t.task_id
         WHERE td.blocked_by = ?`,
        [taskId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update dependency status
  static async updateStatus(dependencyId, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE task_dependency SET status = ? WHERE dependency_id = ?',
        [status, dependencyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Resolve dependency
  static async resolveDependency(dependencyId) {
    try {
      const [result] = await pool.execute(
        "UPDATE task_dependency SET status = 'resolved' WHERE dependency_id = ?",
        [dependencyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete dependency
  static async deleteDependency(dependencyId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM task_dependency WHERE dependency_id = ?',
        [dependencyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if task is blocked
  static async isTaskBlocked(taskId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM task_dependency 
         WHERE task_id = ? AND status = 'blocked'`,
        [taskId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Auto-resolve dependencies when a task is completed
  static async autoResolveDependencies(taskId) {
    try {
      const [result] = await pool.execute(
        "UPDATE task_dependency SET status = 'resolved' WHERE blocked_by = ?",
        [taskId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskDependency;