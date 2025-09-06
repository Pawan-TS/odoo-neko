const { pool } = require('../config/db');

class Tunnel {
  // Create a new tunnel connection
  static async create(sourceType, sourceId, targetType, targetId, similarity) {
    try {
      // Check if tunnel already exists
      const [existing] = await pool.execute(
        `SELECT * FROM tunnels 
         WHERE (source_type = ? AND source_id = ? AND target_type = ? AND target_id = ?)
         OR (source_type = ? AND source_id = ? AND target_type = ? AND target_id = ?)`,
        [sourceType, sourceId, targetType, targetId, targetType, targetId, sourceType, sourceId]
      );
      
      if (existing.length > 0) {
        // Update similarity if tunnel exists
        await pool.execute(
          'UPDATE tunnels SET similarity = ? WHERE tunnel_id = ?',
          [similarity, existing[0].tunnel_id]
        );
        return existing[0].tunnel_id;
      }
      
      // Create new tunnel
      const [result] = await pool.execute(
        'INSERT INTO tunnels (source_type, source_id, target_type, target_id, similarity) VALUES (?, ?, ?, ?, ?)',
        [sourceType, sourceId, targetType, targetId, similarity]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get tunnels for an item
  static async findByItem(itemType, itemId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM tunnels 
         WHERE (source_type = ? AND source_id = ?)
         OR (target_type = ? AND target_id = ?)
         ORDER BY similarity DESC`,
        [itemType, itemId, itemType, itemId]
      );
      
      // Process results to normalize direction
      return rows.map(tunnel => {
        if (tunnel.target_type === itemType && tunnel.target_id === itemId) {
          // Swap source and target to normalize
          return {
            tunnel_id: tunnel.tunnel_id,
            source_type: tunnel.target_type,
            source_id: tunnel.target_id,
            target_type: tunnel.source_type,
            target_id: tunnel.source_id,
            similarity: tunnel.similarity,
            created_at: tunnel.created_at,
            is_verified: tunnel.is_verified
          };
        }
        return tunnel;
      });
    } catch (error) {
      throw error;
    }
  }

  // Get project-wide tunnels
  static async findByProject(projectId) {
    try {
      // Get tasks in this project
      const [tasks] = await pool.execute(
        'SELECT task_id FROM tasks WHERE project_id = ?',
        [projectId]
      );
      
      if (!tasks.length) return [];
      
      const taskIds = tasks.map(t => t.task_id);
      const placeholders = taskIds.map(() => '?').join(',');
      
      // Get tunnels involving project tasks
      const [rows] = await pool.execute(
        `SELECT t.* FROM tunnels t
         WHERE (t.source_type = 'task' AND t.source_id IN (${placeholders}))
         OR (t.target_type = 'task' AND t.target_id IN (${placeholders}))
         ORDER BY t.similarity DESC`,
        [...taskIds, ...taskIds]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Verify a tunnel
  static async verifyTunnel(tunnelId, userId) {
    try {
      const [result] = await pool.execute(
        'UPDATE tunnels SET is_verified = 1, verified_by = ? WHERE tunnel_id = ?',
        [userId, tunnelId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a tunnel
  static async deleteTunnel(tunnelId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM tunnels WHERE tunnel_id = ?',
        [tunnelId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get details for tunnel display (names and content)
  static async getTunnelDetails(tunnelId) {
    try {
      const [tunnels] = await pool.execute(
        'SELECT * FROM tunnels WHERE tunnel_id = ?',
        [tunnelId]
      );
      
      if (!tunnels.length) return null;
      
      const tunnel = tunnels[0];
      const sourceDetails = await this.getItemDetails(tunnel.source_type, tunnel.source_id);
      const targetDetails = await this.getItemDetails(tunnel.target_type, tunnel.target_id);
      
      return {
        tunnel_id: tunnel.tunnel_id,
        similarity: tunnel.similarity,
        created_at: tunnel.created_at,
        is_verified: tunnel.is_verified,
        source: {
          type: tunnel.source_type,
          id: tunnel.source_id,
          ...sourceDetails
        },
        target: {
          type: tunnel.target_type,
          id: tunnel.target_id,
          ...targetDetails
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Helper to get item details
  static async getItemDetails(itemType, itemId) {
    try {
      switch (itemType) {
        case 'task':
          const [tasks] = await pool.execute(
            'SELECT title, description FROM tasks WHERE task_id = ?',
            [itemId]
          );
          return tasks.length ? { title: tasks[0].title, content: tasks[0].description } : null;
          
        case 'comment':
          const [comments] = await pool.execute(
            'SELECT content FROM comments WHERE comment_id = ?',
            [itemId]
          );
          return comments.length ? { title: 'Comment', content: comments[0].content } : null;
          
        default:
          return { title: 'Unknown', content: 'Unknown item type' };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tunnel;