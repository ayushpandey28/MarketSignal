const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');
const { recordSignal } = require('../services/demandEngine');
const { asyncHandler } = require('../middleware/errorMiddleware');

exports.list = asyncHandler(async (req, res) => {
  const alerts = await PriceAlert.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('productId');
  res.json({ success: true, data: alerts.filter((a) => a.productId) });
});

exports.create = asyncHandler(async (req, res) => {
  const { productId, targetPrice } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const safeTargetPrice = Number(targetPrice);
  if (!Number.isFinite(safeTargetPrice) || safeTargetPrice <= 0) {
    const error = new Error('A valid target price is required');
    error.statusCode = 400;
    throw error;
  }

  const existing = await PriceAlert.findOne({
    userId: req.user._id,
    productId,
    active: true,
  }).sort({ createdAt: -1 });

  if (existing) {
    return res.json({
      success: true,
      data: existing,
      message: 'An active alert for this product already exists.',
    });
  }

  const isTriggered = safeTargetPrice >= product.price;
  const alert = await PriceAlert.create({
    userId: req.user._id,
    productId,
    targetPrice: safeTargetPrice,
    active: safeTargetPrice < product.price,
    notified: isTriggered,
    triggeredAt: isTriggered ? new Date() : undefined,
  });

  await recordSignal({
    userId: req.user._id,
    productId,
    type: 'price_alert',
    region: req.user.region,
  });

  res.status(201).json({ success: true, data: alert });
});

exports.remove = asyncHandler(async (req, res) => {
  await PriceAlert.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ success: true, message: 'Alert removed' });
});
