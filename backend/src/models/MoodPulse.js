const { pool } = require('../config/db');

class MoodPulse {
  // Submit mood pulse
  static async submitMood(userId, projectId, moodValue, comment = null) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO mood_pulse (user_id, project_id, mood_value, comment) VALUES (?, ?, ?, ?)',
        [userId, projectId, moodValue, comment]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get user's recent mood submissions
  static async getUserMoods(userId, projectId, limit = 10) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM mood_pulse 
         WHERE user_id = ? AND project_id = ?
         ORDER BY created_at DESC
         LIMIT ?`,
        [userId, projectId, limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get project mood aggregate
  static async getProjectMoodAggregate(projectId, daysBack = 30) {
    try {
      // Overall mood average
      const [avgResult] = await pool.execute(
        `SELECT AVG(mood_value) as average
         FROM mood_pulse
         WHERE project_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [projectId, daysBack]
      );
      
      // Mood distribution
      const [distribution] = await pool.execute(
        `SELECT 
          mood_value,
          COUNT(*) as count,
          (COUNT(*) / (SELECT COUNT(*) FROM mood_pulse WHERE project_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY))) as percentage
         FROM mood_pulse
         WHERE project_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY mood_value
         ORDER BY mood_value`,
        [projectId, daysBack, projectId, daysBack]
      );
      
      // Trend over time (weekly averages)
      const [trend] = await pool.execute(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%u') as week,
          AVG(mood_value) as average,
          COUNT(*) as submissions
         FROM mood_pulse
         WHERE project_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY week
         ORDER BY week`,
        [projectId, daysBack]
      );
      
      // Recent comments (anonymized)
      const [comments] = await pool.execute(
        `SELECT 
          mood_value,
          comment,
          DATE_FORMAT(created_at, '%Y-%m-%d') as date
         FROM mood_pulse
         WHERE project_id = ? AND comment IS NOT NULL AND comment != ''
         ORDER BY created_at DESC
         LIMIT 10`,
        [projectId]
      );
      
      return {
        average: parseFloat(avgResult[0]?.average || 0).toFixed(1),
        distribution,
        trend,
        comments
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if user already submitted mood today
  static async hasSubmittedToday(userId, projectId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM mood_pulse 
         WHERE user_id = ? AND project_id = ? 
         AND DATE(created_at) = CURDATE()`,
        [userId, projectId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MoodPulse;