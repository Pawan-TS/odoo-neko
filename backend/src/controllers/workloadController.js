const Workload = require('../models/Workload');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const workloadService = require('../services/workloadService');

// Get project workload
exports.getProjectWorkload = async (req, res) => {
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
    
    // Get workload
    const workload = await Workload.getProjectWorkload(projectId);
    
    // Enhance with additional metrics
    const enhancedWorkload = await workloadService.enhanceWorkloadData(workload, projectId);
    
    res.status(200).json({ workload: enhancedWorkload });
  } catch (error) {
    console.error('Error getting project workload:', error);
    res.status(500).json({ message: 'An error occurred while fetching the workload data' });
  }
};

// Suggest workload rebalancing
exports.suggestRebalance = async (req, res) => {
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
    
    // Get workload rebalance suggestions
    const rebalanceSuggestions = await Workload.suggestRebalance(projectId);
    
    // If no suggestions, try to recalculate workload first
    if (!rebalanceSuggestions.suggestions || rebalanceSuggestions.suggestions.length === 0) {
      // Get all project members
      const members = await ProjectMember.getProjectMembers(projectId);
      
      // Recalculate workload for all members
      for (const member of members) {
        await Workload.recalculate(member.user_id, projectId);
      }
      
      // Try again
      const updatedSuggestions = await Workload.suggestRebalance(projectId);
      
      res.status(200).json(updatedSuggestions);
    } else {
      res.status(200).json(rebalanceSuggestions);
    }
  } catch (error) {
    console.error('Error suggesting workload rebalance:', error);
    res.status(500).json({ message: 'An error occurred while calculating rebalance suggestions' });
  }
};

// Update user workload (recalculate)
exports.recalculateUserWorkload = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.params.userId;
    const currentUserId = req.user.userId;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if current user is member of project
    const isMember = await ProjectMember.isMember(projectId, currentUserId);
    if (!isMember) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Check if target user is member of project
    const isTargetMember = await ProjectMember.isMember(projectId, userId);
    if (!isTargetMember) {
      return res.status(400).json({ message: 'User is not a member of this project' });
    }
    
    // Recalculate workload
    const result = await Workload.recalculate(userId, projectId);
    
    res.status(200).json({ 
      message: 'Workload recalculated successfully',
      workload: result
    });
  } catch (error) {
    console.error('Error recalculating workload:', error);
    res.status(500).json({ message: 'An error occurred while recalculating the workload' });
  }
};