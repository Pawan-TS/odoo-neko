const { pool } = require('../config/db');

class Task {
  // Create a new task
  static async create(projectId, title, description, status = 'todo', dueDate = null) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO Tasks (project_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)',
        [projectId, title, description, status, dueDate]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get task by ID
  static async findById(taskId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Tasks WHERE task_id = ?',
        [taskId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get tasks for a project
  static async findByProjectId(projectId, filters = {}) {
    try {
      let query = 'SELECT * FROM Tasks WHERE project_id = ?';
      const params = [projectId];
      
      // Apply filters if provided
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      if (filters.dueDate) {
        query += ' AND due_date <= ?';
        params.push(filters.dueDate);
      }
      
      // Add sorting
      query += ' ORDER BY due_date ASC, created_at DESC';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update task
  static async update(taskId, taskData) {
    try {
      const { title, description, status, dueDate } = taskData;
      const [result] = await pool.execute(
        'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE task_id = ?',
        [title, description, status, dueDate, taskId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update task status
  static async updateStatus(taskId, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE tasks SET status = ? WHERE task_id = ?',
        [status, taskId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete task
  static async delete(taskId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM Tasks WHERE task_id = ?',
        [taskId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get tasks assigned to a user in a project
  static async findByUserAndProject(userId, projectId) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.* 
         FROM Tasks t
         JOIN TaskAssignments ta ON t.task_id = ta.task_id
         WHERE ta.user_id = ? AND t.project_id = ?
         ORDER BY t.due_date ASC, t.created_at DESC`,
        [userId, projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get overdue tasks for a project
  static async getOverdueTasks(projectId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM Tasks 
         WHERE project_id = ? 
         AND due_date < CURDATE() 
         AND status != 'done'`,
        [projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Task;