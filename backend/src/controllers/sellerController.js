const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Signal = require('../models/Signal');
const PriceAlert = require('../models/PriceAlert');
const DemandSignal = require('../models/DemandSignal');
const { opportunityRows, demandOverTime, categoryDemand } = require('../services/marketAnalytics');
const { asyncHandler } = require('../middleware/errorMiddleware');

async function sellerProfile(req) {
  const seller = await Seller.findOne({ user: req.user._id });
  if (seller) return seller;
  if (req.user.role === 'admin') {
    const fallback = await Seller.findOne();
    if (fallback) return fallback;
  }
  const error = new Error('Seller profile not found');
  error.statusCode = 404;
  throw error;
}

exports.dashboard = asyncHandler(async (req, res) => {
  const seller = await sellerProfile(req);
  const products = await Product.find({ seller: seller._id, isActive: true });
  const productIds = products.map((p) => p._id);

  const [signals, views, interests, alerts, inventory, demand] = await Promise.all([
    Signal.countDocuments({ productId: { $in: productIds } }),
    Signal.countDocuments({ productId: { $in: productIds }, type: 'view' }),
    Signal.countDocuments({ productId: { $in: productIds }, type: 'interest' }),
    PriceAlert.countDocuments({ productId: { $in: productIds }, active: true }),
    Inventory.find({ sellerId: seller._id }).populate('productId'),
    DemandSignal.find({ productId: { $in: productIds }, region: 'All' }).populate('productId'),
  ]);

  const opportunities = await opportunityRows(8);

  res.json({
    success: true,
    data: {
      seller,
      totals: {
        products: products.length,
        signals,
        views,
        interests,
        activeAlerts: alerts,
      },
      inventory: inventory.filter((i) => i.productId),
      trending: demand
        .filter((d) => d.productId)
        .sort((a, b) => b.currentScore - a.currentScore)
        .slice(0, 8),
      opportunities,
    },
  });
});

exports.opportunities = asyncHandler(async (req, res) => {
  const data = await opportunityRows(20);
  res.json({ success: true, data });
});

exports.analytics = asyncHandler(async (req, res) => {
  const seller = await sellerProfile(req);
  const products = await Product.find({ seller: seller._id, isActive: true }).select('_id');
  const productIds = products.map((p) => p._id);
  const timeline = await demandOverTime(undefined, 14);
  const categories = await categoryDemand();
  const demand = await DemandSignal.find({ productId: { $in: productIds }, region: 'All' }).populate(
    'productId',
    'name category'
  );
  res.json({ success: true, data: { timeline, categories, demand } });
});

exports.inventory = asyncHandler(async (req, res) => {
  const seller = await sellerProfile(req);
  const items = await Inventory.find({ sellerId: seller._id }).populate('productId');
  res.json({ success: true, data: items.filter((i) => i.productId) });
});

exports.myProducts = asyncHandler(async (req, res) => {
  const seller = await sellerProfile(req);
  const products = await Product.find({ seller: seller._id, isActive: true }).sort({ createdAt: -1 });
  const ids = products.map((product) => product._id);
  const demand = await DemandSignal.find({ productId: { $in: ids }, region: 'All' });
  const demandByProduct = new Map(demand.map((row) => [String(row.productId), row]));
  const data = products.map((product) => {
    const row = demandByProduct.get(String(product._id));
    return {
      ...product.toObject(),
      demandScore: row?.currentScore || 0,
      growthPercent: row?.growthPercent || 0,
      trend: row?.trend || 'stable',
    };
  });
  res.json({ success: true, data });
});
