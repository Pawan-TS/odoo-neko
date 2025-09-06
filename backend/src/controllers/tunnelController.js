const Tunnel = require('../models/Tunnel');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');
const tunnelService = require('../services/tunnelService');

// Generate tunnels
exports.generateTunnels = async (req, res) => {
  try {
    const { sourceType, sourceId, threshold = 0.7 } = req.body;
    const userId = req.user.userId;
    
    // Validate input
    if (!sourceType || !sourceId) {
      return res.status(400).json({ message: 'Source type and ID are required' });
    }
    
    // Get project ID based on source type and ID
    let projectId;
    if (sourceType === 'task') {
      const task = await Task.findById(sourceId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      projectId = task.project_id;
    } else {
      return res.status(400).json({ message: 'Unsupported source type' });
    }
    
    // Check if user is member of project
    const isMember = await ProjectMember.isMember(projectId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this content' });
    }
    
    // Generate tunnels using AI service
    const tunnels = await tunnelService.generateTunnels(sourceType, sourceId, projectId, parseFloat(threshold));
    
    res.status(200).json({ 
      message: `Generated ${tunnels.length} tunnels`,
      tunnels 
    });
  } catch (error) {
    console.error('Error generating tunnels:', error);
    res.status(500).json({ message: 'An error occurred while generating tunnels' });
  }
};

// Get tunnels for an item
exports.getTunnelById = async (req, res) => {
  try {
    const tunnelId = req.params.id;
    const userId = req.user.userId;
    
    // Get tunnel with details
    const tunnel = await Tunnel.getTunnelDetails(tunnelId);
    if (!tunnel) {
      return res.status(404).json({ message: 'Tunnel not found' });
    }
    
    // Get project ID based on source type
    let projectId;
    if (tunnel.source.type === 'task') {
      const task = await Task.findById(tunnel.source.id);
      if (task) {
        projectId = task.project_id;
      }
    } else if (tunnel.target.type === 'task') {
      const task = await Task.findById(tunnel.target.id);
      if (task) {
        projectId = task.project_id;
      }
    }
    
    // Check if user is member of project
    if (projectId) {
      const isMember = await ProjectMember.isMember(projectId, userId);
      if (!isMember) {
        return res.status(403).json({ message: 'You do not have access to this content' });
      }
    } else {
      return res.status(404).json({ message: 'Related project not found' });
    }
    
    res.status(200).json({ tunnel });
  } catch (error) {
    console.error('Error getting tunnel:', error);
    res.status(500).json({ message: 'An error occurred while fetching the tunnel' });
  }
};

// Get tunnels for a project
exports.getProjectTunnels = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member of project
    const isMember = await ProjectMember.isMember(projectId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Get project tunnels
    const tunnels = await Tunnel.findByProject(projectId);
    
    // Add metadata to tunnels
    const enhancedTunnels = await Promise.all(tunnels.map(async (tunnel) => {
      const sourceDetails = await Tunnel.getItemDetails(tunnel.source_type, tunnel.source_id);
      const targetDetails = await Tunnel.getItemDetails(tunnel.target_type, tunnel.target_id);
      
      return {
        ...tunnel,
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
    }));
    
    // Group tunnels by type
    const groupedTunnels = tunnelService.groupTunnelsByType(enhancedTunnels);
    
    res.status(200).json({ 
      tunnels: enhancedTunnels,
      grouped: groupedTunnels
    });
  } catch (error) {
    console.error('Error getting project tunnels:', error);
    res.status(500).json({ message: 'An error occurred while fetching project tunnels' });
  }
};

// Verify tunnel
exports.verifyTunnel = async (req, res) => {
  try {
    const tunnelId = req.params.id;
    const userId = req.user.userId;
    
    // Get tunnel details
    const tunnel = await Tunnel.getTunnelDetails(tunnelId);
    if (!tunnel) {
      return res.status(404).json({ message: 'Tunnel not found' });
    }
    
    // Get project ID based on source type
    let projectId;
    if (tunnel.source.type === 'task') {
      const task = await Task.findById(tunnel.source.id);
      if (task) {
        projectId = task.project_id;
      }
    } else if (tunnel.target.type === 'task') {
      const task = await Task.findById(tunnel.target.id);
      if (task) {
        projectId = task.project_id;
      }
    }
    
    // Check if user is member of project
    if (projectId) {
      const isMember = await ProjectMember.isMember(projectId, userId);
      if (!isMember) {
        return res.status(403).json({ message: 'You do not have access to verify this tunnel' });
      }
    } else {
      return res.status(404).json({ message: 'Related project not found' });
    }
    
    // Verify tunnel
    await Tunnel.verifyTunnel(tunnelId, userId);
    
    res.status(200).json({ message: 'Tunnel verified successfully' });
  } catch (error) {
    console.error('Error verifying tunnel:', error);
    res.status(500).json({ message: 'An error occurred while verifying the tunnel' });
  }
};

// Delete tunnel
exports.deleteTunnel = async (req, res) => {
  try {
    const tunnelId = req.params.id;
    const userId = req.user.userId;
    
    // Get tunnel details
    const tunnel = await Tunnel.getTunnelDetails(tunnelId);
    if (!tunnel) {
      return res.status(404).json({ message: 'Tunnel not found' });
    }
    
    // Get project ID based on source type
    let projectId;
    if (tunnel.source.type === 'task') {
      const task = await Task.findById(tunnel.source.id);
      if (task) {
        projectId = task.project_id;
      }
    } else if (tunnel.target.type === 'task') {
      const task = await Task.findById(tunnel.target.id);
      if (task) {
        projectId = task.project_id;
      }
    }
    
    // Check if user is admin of project
    if (projectId) {
      const isAdmin = await ProjectMember.isOwnerOrAdmin(projectId, userId);
      if (!isAdmin) {
        return res.status(403).json({ message: 'You do not have permission to delete this tunnel' });
      }
    } else {
      return res.status(404).json({ message: 'Related project not found' });
    }
    
    // Delete tunnel
    await Tunnel.deleteTunnel(tunnelId);
    
    res.status(200).json({ message: 'Tunnel deleted successfully' });
  } catch (error) {
    console.error('Error deleting tunnel:', error);
    res.status(500).json({ message: 'An error occurred while deleting the tunnel' });
  }
};