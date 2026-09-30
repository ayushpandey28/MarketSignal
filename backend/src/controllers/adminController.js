const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Signal = require('../models/Signal');
const PriceAlert = require('../models/PriceAlert');
const DemandSignal = require('../models/DemandSignal');
const { categoryDemand, recentSignals, regionalDemand } = require('../services/marketAnalytics');
const { asyncHandler } = require('../middleware/errorMiddleware');

exports.users = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -resetToken').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

exports.sellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find().populate('user', 'name email region');
  res.json({ success: true, data: sellers });
});

exports.products = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).populate('seller', 'companyName');
  res.json({ success: true, data: products });
});

exports.signals = asyncHandler(async (req, res) => {
  const data = await recentSignals(50);
  res.json({ success: true, data });
});

exports.analytics = asyncHandler(async (req, res) => {
  const [users, sellers, products, signals, alerts, categories, regions, trending] = await Promise.all([
    User.countDocuments(),
    Seller.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Signal.countDocuments(),
    PriceAlert.countDocuments({ active: true }),
    categoryDemand(),
    regionalDemand(),
    DemandSignal.find({ region: 'All', trend: 'rising' })
      .sort({ growthPercent: -1 })
      .limit(8)
      .populate('productId', 'name category'),
  ]);

  res.json({
    success: true,
    data: {
      totals: { users, sellers, products, signals, activeAlerts: alerts },
      categories,
      regions,
      trending: trending.filter((t) => t.productId),
    },
  });
});

exports.toggleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: { id: user._id, isActive: user.isActive } });
});

exports.categories = asyncHandler(async (req, res) => {
  const names = await Product.distinct('category');
  res.json({ success: true, data: names.sort() });
});

exports.addCategory = asyncHandler(async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    const error = new Error('Category name is required');
    error.statusCode = 400;
    throw error;
  }
  const exists = await Product.exists({ category: name });
  if (exists) {
    return res.json({ success: true, data: name, message: 'Category already in use' });
  }
  await Product.create({
    name: `${name} placeholder`,
    description: 'Admin-created category placeholder. Replace with a real listing.',
    category: name,
    brand: 'MarketSignal',
    price: 0,
    stock: 0,
    region: 'United States',
    isActive: false,
    isDemo: true,
  });
  res.status(201).json({ success: true, data: name });
});
