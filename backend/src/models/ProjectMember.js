const { pool } = require('../config/db');

class ProjectMember {
  // Add member to project
  static async addMember(projectId, userId, role = 'member') {
    try {
      const [result] = await pool.execute(
        'INSERT INTO ProjectMembers (project_id, user_id, role) VALUES (?, ?, ?)',
        [projectId, userId, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get project members
  static async getProjectMembers(projectId) {
    try {
      const [rows] = await pool.execute(
        `SELECT pm.*, u.name, u.email 
         FROM ProjectMembers pm
         JOIN Users u ON pm.user_id = u.user_id
         WHERE pm.project_id = ?`,
        [projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is member of project
  static async isMember(projectId, userId) {
    try {
      console.log('Checking project membership:', projectId, userId);
      const [rows] = await pool.execute(
        'SELECT * FROM ProjectMembers WHERE project_id = ? AND user_id = ?',
        [projectId, userId]
      );
      console.log('ProjectMembers query result:', rows);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Update member role
  static async updateRole(projectId, userId, role) {
    try {
      const [result] = await pool.execute(
        'UPDATE ProjectMembers SET role = ? WHERE project_id = ? AND user_id = ?',
        [role, projectId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Remove member from project
  static async removeMember(projectId, userId) {
    try {
      console.log('Removing member from project:', projectId, userId);
      const [result] = await pool.execute(
        'DELETE FROM ProjectMembers WHERE project_id = ? AND user_id = ?',
        [projectId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is project owner or admin
  static async isOwnerOrAdmin(projectId, userId) {
    try {
      console.log('Checking if user is owner/admin:', projectId, userId);
      
      // First, check if user is a project member with owner/admin role
      const [projectRows] = await pool.execute(
        "SELECT * FROM ProjectMembers WHERE project_id = ? AND user_id = ? AND role IN ('owner', 'admin')",
        [projectId, userId]
      );
      
      if (projectRows.length > 0) {
        console.log('User is project owner/admin');
        return true;
      }
      
      // If not, check if user is system-wide admin
      const [userRows] = await pool.execute(
        "SELECT * FROM Users WHERE user_id = ? AND role = 'admin'",
        [userId]
      );
      
      console.log('User system role check:', userRows);
      return userRows.length > 0;
    } catch (error) {
      console.error('Error in isOwnerOrAdmin:', error);
      throw error;
    }
  }
  
  // Get a specific project member
  static async getProjectMember(projectId, memberId) {
    try {
      console.log('Getting project member:', projectId, memberId);
      const [rows] = await pool.execute(
        `SELECT pm.*, u.name, u.email 
         FROM ProjectMembers pm
         JOIN Users u ON pm.user_id = u.user_id
         WHERE pm.project_id = ? AND pm.user_id = ?`,
        [projectId, memberId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error getting project member:', error);
      throw error;
    }
  }
}

module.exports = ProjectMember;