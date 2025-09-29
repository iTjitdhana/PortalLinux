const jwt = require('jsonwebtoken');
const { User } = require('../models');

const optionalAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      // Invalid user, continue without authentication
      req.user = null;
      return next();
    }

    // Check if user is active
    if (!user.isActive()) {
      // Inactive user, continue without authentication
      req.user = null;
      return next();
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      status: user.status
    };

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    
    // On any error, continue without authentication
    req.user = null;
    next();
  }
};

module.exports = optionalAuth;
