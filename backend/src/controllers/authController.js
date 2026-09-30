const User = require('../models/User');
const Seller = require('../models/Seller');
const { generateToken } = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');
const crypto = require('crypto');

async function publicUser(user) {
  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
  if (user.role === 'seller') {
    const seller = await Seller.findOne({ user: user._id }).select('companyName');
    if (seller) data.companyName = seller.companyName;
  }
  return data;
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, region, companyName } = req.body;
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const allowedRoles = ['consumer', 'seller'];
  const selectedRole = allowedRoles.includes(role) ? role : 'consumer';

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: selectedRole,
    region: region || 'United States',
  });

  if (selectedRole === 'seller') {
    await Seller.create({
      user: user._id,
      companyName: companyName || `${name}'s Store`,
      region: user.region,
    });
  }

  const token = generateToken(user);
  res.status(201).json({ success: true, data: { user: await publicUser(user), token } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  res.json({ success: true, data: { user: await publicUser(user), token } });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await publicUser(req.user) });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user) {
    return res.json({
      success: true,
      message: 'If that email exists, a reset token was created.',
    });
  }

  const resetToken = crypto.randomBytes(16).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Reset token created for demo use.',
    data: { resetToken },
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;
  const user = await User.findOne({
    email: (email || '').toLowerCase(),
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, region } = req.body;
  if (name) req.user.name = name;
  if (region) req.user.region = region;
  await req.user.save();
  res.json({ success: true, data: await publicUser(req.user) });
});
