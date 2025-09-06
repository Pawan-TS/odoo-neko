const { pool } = require('../config/db');

class TaskAssignment {
  // Assign task to user
  static async assignTask(taskId, userId) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO TaskAssignments (task_id, user_id) VALUES (?, ?)',
        [taskId, userId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get task assignments
  static async getAssignments(taskId) {
    try {
      const [rows] = await pool.execute(
        `SELECT ta.*, u.name, u.email 
         FROM TaskAssignments ta
         JOIN Users u ON ta.user_id = u.user_id
         WHERE ta.task_id = ?`,
        [taskId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is assigned to task
  static async isAssigned(taskId, userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM TaskAssignments WHERE task_id = ? AND user_id = ?',
        [taskId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Remove assignment
  static async removeAssignment(taskId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM TaskAssignments WHERE task_id = ? AND user_id = ?',
        [taskId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get tasks assigned to a user
  static async getTasksForUser(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.*, p.name as project_name 
         FROM tasks t
         JOIN task_assignments ta ON t.task_id = ta.task_id
         JOIN projects p ON t.project_id = p.project_id
         WHERE ta.user_id = ?
         ORDER BY t.due_date ASC, t.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get assignees for multiple tasks
  static async getAssigneesForTasks(taskIds) {
    try {
      if (!taskIds.length) return {};
      
      const placeholders = taskIds.map(() => '?').join(',');
      const [rows] = await pool.execute(
        `SELECT ta.task_id, u.user_id, u.name, u.email 
         FROM TaskAssignments ta
         JOIN Users u ON ta.user_id = u.user_id
         WHERE ta.task_id IN (${placeholders})`,
        taskIds
      );
      
      // Group by task_id
      const assigneesByTask = {};
      rows.forEach(row => {
        if (!assigneesByTask[row.task_id]) {
          assigneesByTask[row.task_id] = [];
        }
        assigneesByTask[row.task_id].push({
          user_id: row.user_id,
          name: row.name,
          email: row.email
        });
      });
      
      return assigneesByTask;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskAssignment;