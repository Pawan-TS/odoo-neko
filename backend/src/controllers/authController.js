const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// User registration
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide all required fields (name, email, password)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      role: role || 'member'
    };

    const userId = await User.create(userData);
    
    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user_id: userId,
        name,
        email,
        role: role || 'member'
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'An error occurred during registration' 
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid email or password' 
      });
    }

    // Validate password
    const isPasswordValid = await User.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.user_id);

    res.status(200).json({
      status: 'success',
      token: token,
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'An error occurred during login' 
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'An error occurred' 
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide current and new password' 
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    // Validate current password
    const isPasswordValid = await User.validatePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    await User.updatePassword(userId, newPassword);

    res.status(200).json({ 
      status: 'success',
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'An error occurred' 
    });
  }
};