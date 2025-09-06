const Tunnel = require('../models/Tunnel');
const Task = require('../models/Task');
const { calculateCosineSimilarity } = require('../utils/embeddings');

// Generate tunnels between items
exports.generateTunnels = async (sourceType, sourceId, projectId, threshold = 0.7) => {
  try {
    // Get source content
    let sourceContent = await getItemContent(sourceType, sourceId);
    if (!sourceContent) {
      throw new Error('Source content not found');
    }
    
    // Get potential targets (tasks in the same project for now)
    const tasks = await Task.findByProjectId(projectId);
    const potentialTargets = tasks
      .filter(task => task.task_id != sourceId) // Exclude self
      .map(task => ({
        type: 'task',
        id: task.task_id,
        content: task.title + ' ' + (task.description || '')
      }));
    
    // Calculate similarity and create tunnels
    const tunnels = [];
    for (const target of potentialTargets) {
      // Calculate similarity
      const similarity = calculateCosineSimilarity(sourceContent, target.content);
      
      // Create tunnel if similarity is above threshold
      if (similarity >= threshold) {
        const tunnelId = await Tunnel.create(
          sourceType,
          sourceId,
          target.type,
          target.id,
          similarity
        );
        
        // Get created tunnel with details
        const tunnel = await Tunnel.getTunnelDetails(tunnelId);
        tunnels.push(tunnel);
      }
    }
    
    return tunnels;
  } catch (error) {
    console.error('Error generating tunnels:', error);
    throw error;
  }
};

// Group tunnels by type for visualization
exports.groupTunnelsByType = (tunnels) => {
  try {
    const grouped = {
      taskToTask: [],
      taskToComment: [],
      commentToComment: []
    };
    
    tunnels.forEach(tunnel => {
      const sourceType = tunnel.source?.type || tunnel.source_type;
      const targetType = tunnel.target?.type || tunnel.target_type;
      
      if (sourceType === 'task' && targetType === 'task') {
        grouped.taskToTask.push(tunnel);
      } else if ((sourceType === 'task' && targetType === 'comment') || 
                (sourceType === 'comment' && targetType === 'task')) {
        grouped.taskToComment.push(tunnel);
      } else if (sourceType === 'comment' && targetType === 'comment') {
        grouped.commentToComment.push(tunnel);
      }
    });
    
    return grouped;
  } catch (error) {
    console.error('Error grouping tunnels:', error);
    return { taskToTask: [], taskToComment: [], commentToComment: [] };
  }
};

// Helper to get item content
async function getItemContent(itemType, itemId) {
  try {
    switch (itemType) {
      case 'task':
        const task = await Task.findById(itemId);
        return task ? (task.title + ' ' + (task.description || '')) : null;
        
      case 'comment':
        const [comments] = await require('../config/db').pool.execute(
          'SELECT content FROM comments WHERE comment_id = ?',
          [itemId]
        );
        return comments.length ? comments[0].content : null;
        
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error getting content for ${itemType} ${itemId}:`, error);
    return null;
  }
}