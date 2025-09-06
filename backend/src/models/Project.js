const { pool } = require('../config/db');

class Project {
  // Create a new project
  static async create(name, description, createdBy) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO Projects (name, description, created_by) VALUES (?, ?, ?)',
        [name, description, createdBy]
      );
      
      // Add creator as project owner
      if (result.insertId) {
        console.log('Adding creator as project owner:', result.insertId, createdBy);
        try {
          await pool.execute(
            'INSERT INTO ProjectMembers (project_id, user_id, role) VALUES (?, ?, ?)',
            [result.insertId, createdBy, 'owner']
          );
          console.log('Successfully added project owner');
        } catch (memberError) {
          console.error('Failed to add project owner:', memberError);
          // Continue anyway so the project is still created
        }
      }
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get project by ID
  static async findById(projectId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Projects WHERE project_id = ?',
        [projectId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get projects for a user
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.* 
         FROM Projects p
         JOIN ProjectMembers pm ON p.project_id = pm.project_id
         WHERE pm.user_id = ?
         ORDER BY p.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update project
  static async update(projectId, projectData) {
    try {
      console.log('Project.update called with:', projectId, projectData);
      
      // Build the SQL query dynamically based on provided fields
      let sql = 'UPDATE Projects SET ';
      const params = [];
      const fields = [];
      
      if ('name' in projectData) {
        fields.push('name = ?');
        params.push(projectData.name);
      }
      
      if ('description' in projectData) {
        fields.push('description = ?');
        params.push(projectData.description);
      }
      
      // If no fields to update, return early
      if (fields.length === 0) {
        console.log('No fields to update');
        return true;
      }
      
      sql += fields.join(', ') + ' WHERE project_id = ?';
      params.push(projectId);
      
      console.log('SQL query:', sql);
      console.log('Parameters:', params);
      
      const [result] = await pool.execute(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete project
  static async delete(projectId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM Projects WHERE project_id = ?',
        [projectId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get project stats
  static async getStats(projectId) {
    try {
      const [taskStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done
         FROM tasks
         WHERE project_id = ?`,
        [projectId]
      );
      
      const [memberCount] = await pool.execute(
        'SELECT COUNT(*) as count FROM ProjectMembers WHERE project_id = ?',
        [projectId]
      );
      
      return {
        tasks: taskStats[0],
        members: memberCount[0].count
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;