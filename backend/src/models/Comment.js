const { pool } = require('../config/db');

class Comment {
  // Create a new comment
  static async create(taskId, userId, content) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
        [taskId, userId, content]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get comments for a task
  static async findByTaskId(taskId) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.*, u.name, u.email 
         FROM comments c
         JOIN users u ON c.user_id = u.user_id
         WHERE c.task_id = ?
         ORDER BY c.created_at ASC`,
        [taskId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get comment by ID
  static async findById(commentId) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.*, u.name, u.email 
         FROM comments c
         JOIN users u ON c.user_id = u.user_id
         WHERE c.comment_id = ?`,
        [commentId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update comment
  static async update(commentId, content) {
    try {
      const [result] = await pool.execute(
        'UPDATE comments SET content = ? WHERE comment_id = ?',
        [content, commentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete comment
  static async delete(commentId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM comments WHERE comment_id = ?',
        [commentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if user owns comment
  static async isOwner(commentId, userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM comments WHERE comment_id = ? AND user_id = ?',
        [commentId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get recent comments for a project
  static async getRecentForProject(projectId, limit = 10) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.*, t.title as task_title, u.name, u.email 
         FROM comments c
         JOIN tasks t ON c.task_id = t.task_id
         JOIN users u ON c.user_id = u.user_id
         WHERE t.project_id = ?
         ORDER BY c.created_at DESC
         LIMIT ?`,
        [projectId, limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Comment;