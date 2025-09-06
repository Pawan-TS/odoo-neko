const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate token middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user
    try {
      const user = await User.findById(decoded.userId);
      console.log('User from DB:', user);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token: User not found' });
      }
      
      // Add user info to request
      req.user = { 
        userId: user.user_id,
        role: user.role
      };
    } catch (dbError) {
      console.error('Database error in auth middleware:', dbError);
      return res.status(500).json({ message: 'Database error while authenticating user' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin access middleware
exports.requireAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};