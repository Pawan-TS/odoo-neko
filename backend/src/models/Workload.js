const { pool } = require('../config/db');

class Workload {
  // Get workload for a project
  static async getProjectWorkload(projectId) {
    try {
      const [rows] = await pool.execute(
        `SELECT w.*, u.name, u.email 
         FROM workload w
         JOIN users u ON w.user_id = u.user_id
         WHERE w.project_id = ?`,
        [projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get workload for a user across all projects
  static async getUserWorkload(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT w.*, p.name as project_name
         FROM workload w
         JOIN projects p ON w.project_id = p.project_id
         WHERE w.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update workload (recalculate based on tasks)
  static async recalculate(userId, projectId) {
    try {
      // Count tasks assigned to user in this project
      const [taskCount] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM tasks t
         JOIN task_assignments ta ON t.task_id = ta.task_id
         WHERE t.project_id = ? AND ta.user_id = ? AND t.status != 'done'`,
        [projectId, userId]
      );
      
      // Calculate estimated hours
      const [hoursResult] = await pool.execute(
        `SELECT SUM(t.estimated_hours) as total 
         FROM tasks t
         JOIN task_assignments ta ON t.task_id = ta.task_id
         WHERE t.project_id = ? AND ta.user_id = ? AND t.status != 'done'`,
        [projectId, userId]
      );
      
      const count = taskCount[0].count || 0;
      const hours = hoursResult[0].total || 0;
      
      // Check if workload entry exists
      const [existing] = await pool.execute(
        'SELECT * FROM workload WHERE user_id = ? AND project_id = ?',
        [userId, projectId]
      );
      
      if (existing.length > 0) {
        // Update existing entry
        await pool.execute(
          'UPDATE workload SET task_count = ?, estimated_hours = ? WHERE user_id = ? AND project_id = ?',
          [count, hours, userId, projectId]
        );
      } else {
        // Create new entry
        await pool.execute(
          'INSERT INTO workload (user_id, project_id, task_count, estimated_hours) VALUES (?, ?, ?, ?)',
          [userId, projectId, count, hours]
        );
      }
      
      return { taskCount: count, estimatedHours: hours };
    } catch (error) {
      throw error;
    }
  }

  // Suggest workload rebalancing
  static async suggestRebalance(projectId) {
    try {
      // Get all project members
      const [members] = await pool.execute(
        `SELECT user_id FROM project_members WHERE project_id = ?`,
        [projectId]
      );
      
      if (!members.length) return [];
      
      // Get current workload for all members
      const [workloads] = await pool.execute(
        `SELECT w.*, u.name
         FROM workload w
         JOIN users u ON w.user_id = u.user_id
         WHERE w.project_id = ?`,
        [projectId]
      );
      
      // Get tasks that could be reassigned (not done, assigned to overloaded members)
      const [tasks] = await pool.execute(
        `SELECT t.*, ta.user_id as assigned_to
         FROM tasks t
         JOIN task_assignments ta ON t.task_id = ta.task_id
         WHERE t.project_id = ? AND t.status != 'done'
         ORDER BY t.due_date ASC`,
        [projectId]
      );
      
      // Simple algorithm to suggest reassignments
      // In a real app, this would be much more sophisticated
      const suggestions = [];
      const memberIds = members.map(m => m.user_id);
      
      // Convert workloads to a map for easier lookup
      const workloadMap = {};
      workloads.forEach(w => {
        workloadMap[w.user_id] = {
          taskCount: w.task_count || 0,
          hours: w.estimated_hours || 0,
          name: w.name
        };
      });
      
      // Ensure all members have an entry
      memberIds.forEach(id => {
        if (!workloadMap[id]) {
          workloadMap[id] = { taskCount: 0, hours: 0 };
        }
      });
      
      // Find overloaded and underloaded members
      const avgTaskCount = Object.values(workloadMap).reduce((sum, w) => sum + w.taskCount, 0) / memberIds.length;
      
      const overloaded = memberIds.filter(id => (workloadMap[id].taskCount > avgTaskCount * 1.2));
      const underloaded = memberIds.filter(id => (workloadMap[id].taskCount < avgTaskCount * 0.8));
      
      // Suggest task reassignments
      if (overloaded.length && underloaded.length) {
        for (const task of tasks) {
          if (overloaded.includes(task.assigned_to)) {
            // Find least loaded member
            const targetMember = underloaded.reduce((min, id) => 
              workloadMap[id].taskCount < workloadMap[min].taskCount ? id : min, 
              underloaded[0]
            );
            
            suggestions.push({
              task_id: task.task_id,
              task_title: task.title,
              from_user_id: task.assigned_to,
              from_user_name: workloadMap[task.assigned_to]?.name || 'Unknown',
              to_user_id: targetMember,
              to_user_name: workloadMap[targetMember]?.name || 'Unknown'
            });
            
            // Update theoretical counts
            workloadMap[task.assigned_to].taskCount--;
            workloadMap[targetMember].taskCount++;
            
            // Only suggest a few reassignments
            if (suggestions.length >= 5) break;
          }
        }
      }
      
      return {
        currentWorkload: Object.entries(workloadMap).map(([id, data]) => ({
          user_id: parseInt(id),
          name: data.name,
          task_count: data.taskCount,
          estimated_hours: data.hours
        })),
        suggestions
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Workload;