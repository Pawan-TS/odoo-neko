const User = require('../models/User');
const TaskAssignment = require('../models/TaskAssignment');

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't return password
    const { password, ...userData } = user;

    res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    // Check authorization (only self or admin can update)
    if (req.user.userId != userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    await User.update(userId, { name, email });

    res.status(200).json({ 
      message: 'User updated successfully',
      user: {
        id: userId,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Get user's assigned tasks
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get assigned tasks
    const tasks = await TaskAssignment.getTasksForUser(userId);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error getting user tasks:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Search users (for assignment, etc.)
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    // Use the pool directly for this query
    const [users] = await require('../config/db').pool.execute(
      `SELECT user_id, name, email 
       FROM users 
       WHERE name LIKE ? OR email LIKE ?
       LIMIT 10`,
      [`%${query}%`, `%${query}%`]
    );

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};