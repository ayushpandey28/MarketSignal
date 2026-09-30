const Product = require('../models/Product');
const Signal = require('../models/Signal');
const { recordSignal } = require('../services/demandEngine');
const { asyncHandler } = require('../middleware/errorMiddleware');

async function handleSignal(req, res, type) {
  const productId = req.body.productId;
  const query = typeof req.body.query === 'string' ? req.body.query.trim() : '';
  const region = req.user?.region || req.body.region || 'United States';

  if (type === 'search' && req.body.query !== undefined && typeof req.body.query !== 'string') {
    const error = new Error('Search query must be text');
    error.statusCode = 400;
    throw error;
  }
  if (query.length > 100) {
    const error = new Error('Search query must be 100 characters or fewer');
    error.statusCode = 400;
    throw error;
  }

  if (type !== 'search' && !productId) {
    const error = new Error('productId is required');
    error.statusCode = 400;
    throw error;
  }

  if (type === 'search' && !productId && query && req.user) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = await Product.find({
      isActive: true,
      $or: [
        { name: new RegExp(escaped, 'i') },
        { brand: new RegExp(escaped, 'i') },
        { category: new RegExp(escaped, 'i') },
      ],
    }).select('_id').limit(9);

    if (matches.length) {
      let created = 0;
      for (const product of matches) {
        const result = await recordSignal({
          userId: req.user._id,
          productId: product._id,
          type,
          region,
          query,
        });
        if (result.created) created += 1;
      }
      return res.status(created ? 201 : 200).json({
        success: true,
        data: { created: created > 0, matched: matches.length, recorded: created },
      });
    }
  }

  if (productId) {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
  }

  const result = await recordSignal({
    userId: req.user?._id,
    productId,
    type,
    region,
    query,
  });

  if (type === 'interest' && result.created && productId) {
    await Product.findByIdAndUpdate(productId, { $inc: { interestCount: 1 } });
  }

  res.status(result.created ? 201 : 200).json({
    success: true,
    data: result,
  });
}

exports.searchSignal = asyncHandler(async (req, res) => handleSignal(req, res, 'search'));
exports.viewSignal = asyncHandler(async (req, res) => handleSignal(req, res, 'view'));
exports.interestSignal = asyncHandler(async (req, res) => handleSignal(req, res, 'interest'));

exports.myInterests = asyncHandler(async (req, res) => {
  const signals = await Signal.find({ userId: req.user._id, type: 'interest' })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate({ path: 'productId', match: { isActive: true }, select: 'name category region' });
  const data = signals
    .filter((signal) => signal.productId)
    .map((signal) => ({
      _id: signal._id,
      createdAt: signal.createdAt,
      product: signal.productId,
    }));
  res.json({ success: true, data });
});
