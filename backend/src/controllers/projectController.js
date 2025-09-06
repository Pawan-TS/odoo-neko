const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Task = require('../models/Task');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Create project
    const projectId = await Project.create(name, description, userId);

    // Get created project
    const project = await Project.findById(projectId);

    res.status(201).json({ 
      message: 'Project created successfully',
      project 
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'An error occurred while creating the project' });
  }
};

// Get all projects for current user
exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const projects = await Project.findByUserId(userId);
    
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'An error occurred while fetching projects' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    console.log('Request user object:', req.user);
    const projectId = req.params.id;
    
    // Check if req.user exists before accessing properties
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.userId;
    console.log('Project ID:', projectId, 'User ID:', userId);
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member of project
    const membership = await ProjectMember.isMember(projectId, userId);
    // Check if membership exists or user is admin
    if (!membership && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Get project stats
    const stats = await Project.getStats(projectId);
    
    // Get project members
    const members = await ProjectMember.getProjectMembers(projectId);
    
    // Determine user role - if they're a member use that role, otherwise if they're an admin use 'admin'
    const userRole = membership ? membership.role : (req.user.role === 'admin' ? 'admin' : 'viewer');
    
    res.status(200).json({ 
      project,
      stats,
      members,
      userRole
    });
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ message: 'An error occurred while fetching the project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    console.log('Update project request:', req.method, req.body);
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { name, description } = req.body;
    
    // For PUT requests, name is required
    // For PATCH requests, at least one field must be provided
    if (req.method === 'PUT' && !name) {
      return res.status(400).json({ message: 'Project name is required for PUT request' });
    }
    
    if (req.method === 'PATCH' && Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is admin/owner of project or system-wide admin
    console.log('Checking user permissions for project update:', userId, req.user.role);
    
    // If user is system-wide admin, allow access directly
    if (req.user.role === 'admin') {
      console.log('User is system admin, allowing project update');
    } else {
      // Otherwise check project-specific permissions
      const isAdmin = await ProjectMember.isOwnerOrAdmin(projectId, userId);
      if (!isAdmin) {
        console.log('Permission denied: User is not admin/owner of this project');
        return res.status(403).json({ message: 'You do not have permission to update this project' });
      }
    }
    
    // Prepare update data based on request method
    const updateData = {};
    if (req.method === 'PUT' || name !== undefined) {
      updateData.name = name;
    }
    if (req.method === 'PUT' || description !== undefined) {
      updateData.description = description;
    }
    
    console.log('Updating project with:', updateData);
    
    // Update project
    await Project.update(projectId, updateData);
    
    res.status(200).json({ 
      message: 'Project updated successfully',
      project: {
        ...project,
        ...updateData,
        description
      }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'An error occurred while updating the project' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner of project
    const membership = await ProjectMember.isMember(projectId, userId);
    if (!membership || membership.role !== 'owner') {
      return res.status(403).json({ message: 'Only the project owner can delete this project' });
    }
    
    // Delete project
    await Project.delete(projectId);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'An error occurred while deleting the project' });
  }
};

// Add member to project
exports.addProjectMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { memberEmail, role } = req.body;
    
    // Validate input
    if (!memberEmail) {
      return res.status(400).json({ message: 'Member email is required' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is admin/owner of project
    const isAdmin = await ProjectMember.isOwnerOrAdmin(projectId, userId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to add members to this project' });
    }
    
    // Find user by email
    const user = await require('../models/User').findByEmail(memberEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    // Check if user is already a member
    const membership = await ProjectMember.isMember(projectId, user.user_id);
    if (membership) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }
    
    // Add member
    await ProjectMember.addMember(projectId, user.user_id, role || 'member');
    
    res.status(200).json({ 
      message: 'Member added successfully',
      member: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: role || 'member'
      }
    });
  } catch (error) {
    console.error('Error adding project member:', error);
    res.status(500).json({ message: 'An error occurred while adding the member' });
  }
};

// Get a specific project member
exports.getProjectMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.memberId;
    const userId = req.user.userId;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to the project
    const userMembership = await ProjectMember.isMember(projectId, userId);
    if (!userMembership && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    // Get member details
    const member = await ProjectMember.getProjectMember(projectId, memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found in this project' });
    }
    
    res.status(200).json({ member });
  } catch (error) {
    console.error('Error getting project member:', error);
    res.status(500).json({ message: 'An error occurred while fetching the project member' });
  }
};

// Remove member from project
exports.removeProjectMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.memberId;
    const userId = req.user.userId;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is admin/owner of project
    const isAdmin = await ProjectMember.isOwnerOrAdmin(projectId, userId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to remove members from this project' });
    }
    
    // Cannot remove self if owner
    if (memberId == userId) {
      const membership = await ProjectMember.isMember(projectId, userId);
      if (membership && membership.role === 'owner') {
        return res.status(400).json({ message: 'Project owner cannot be removed' });
      }
    }
    
    // Remove member
    const removed = await ProjectMember.removeMember(projectId, memberId);
    if (!removed) {
      return res.status(404).json({ message: 'Member not found in this project' });
    }
    
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing project member:', error);
    res.status(500).json({ message: 'An error occurred while removing the member' });
  }
};