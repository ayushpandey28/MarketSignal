const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('./errorMiddleware');

function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

const protect = asyncHandler(async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured');
    error.statusCode = 500;
    throw error;
  }

  const token = getBearerToken(req);
  if (!token) {
    const error = new Error('Not authorized');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    const error = new Error('Not authorized');
    error.statusCode = 401;
    throw error;
  }
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  if (!process.env.JWT_SECRET) return next();

  const token = getBearerToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user && user.isActive) req.user = user;
  } catch {
    // ignore invalid optional tokens
  }
  next();
});

module.exports = { protect, optionalAuth };
