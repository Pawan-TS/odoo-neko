const MoodPulse = require('../models/MoodPulse');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const moodService = require('../services/moodService');

// Submit mood
exports.submitMood = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { moodValue, comment } = req.body;
    
    // Validate input
    if (moodValue === undefined || moodValue < 1 || moodValue > 5) {
      return res.status(400).json({ message: 'Mood value must be between 1 and 5' });
    }
    
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
    
    // Check if user already submitted mood today
    const hasSubmitted = await MoodPulse.hasSubmittedToday(userId, projectId);
    if (hasSubmitted) {
      return res.status(400).json({ message: 'You have already submitted your mood today' });
    }
    
    // Submit mood
    const moodId = await MoodPulse.submitMood(userId, projectId, moodValue, comment);
    
    res.status(201).json({ 
      message: 'Mood submitted successfully',
      mood: {
        mood_id: moodId,
        mood_value: moodValue,
        comment: comment,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error submitting mood:', error);
    res.status(500).json({ message: 'An error occurred while submitting your mood' });
  }
};

// Get project mood aggregate
exports.getProjectMood = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { days = 30 } = req.query;
    
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
    
    // Get mood aggregate
    const moodData = await MoodPulse.getProjectMoodAggregate(projectId, parseInt(days));
    
    // Add insights
    const insights = await moodService.generateMoodInsights(moodData, projectId);
    
    // Check if user submitted today
    const hasSubmittedToday = await MoodPulse.hasSubmittedToday(userId, projectId);
    
    // Get user's recent submissions
    const userMoods = await MoodPulse.getUserMoods(userId, projectId, 5);
    
    res.status(200).json({ 
      projectMood: moodData,
      insights,
      userStatus: {
        submittedToday: hasSubmittedToday,
        recentSubmissions: userMoods
      }
    });
  } catch (error) {
    console.error('Error getting project mood:', error);
    res.status(500).json({ message: 'An error occurred while fetching the mood data' });
  }
};

// Get user's mood history
exports.getUserMoodHistory = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { limit = 30 } = req.query;
    
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
    
    // Get user moods
    const moods = await MoodPulse.getUserMoods(userId, projectId, parseInt(limit));
    
    res.status(200).json({ moods });
  } catch (error) {
    console.error('Error getting user mood history:', error);
    res.status(500).json({ message: 'An error occurred while fetching the mood history' });
  }
};