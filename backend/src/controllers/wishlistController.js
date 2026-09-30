const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { recordSignal } = require('../services/demandEngine');
const { asyncHandler } = require('../middleware/errorMiddleware');

exports.list = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ userId: req.user._id }).populate('productId');
  res.json({ success: true, data: items.filter((item) => item.productId) });
});

exports.add = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const existing = await Wishlist.findOne({ userId: req.user._id, productId });
  if (existing) {
    return res.json({ success: true, data: existing, message: 'Already in wishlist' });
  }

  const item = await Wishlist.create({ userId: req.user._id, productId });
  await recordSignal({
    userId: req.user._id,
    productId,
    type: 'wishlist',
    region: req.user.region,
  });
  res.status(201).json({ success: true, data: item });
});

exports.remove = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ success: true, message: 'Removed from wishlist' });
});
