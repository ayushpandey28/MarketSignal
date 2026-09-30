const mongoose = require('mongoose');
const Product = require('../models/Product');
const DemandSignal = require('../models/DemandSignal');
const { opportunityRows, regionalDemand, categoryDemand } = require('../services/marketAnalytics');
const geminiService = require('../services/geminiService');
const { asyncHandler } = require('../middleware/errorMiddleware');
const Seller = require('../models/Seller');

exports.explainTrend = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error('Invalid product ID');
    error.statusCode = 400;
    throw error;
  }
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const demand = await DemandSignal.find({ productId });
  const overall = demand.find((d) => d.region === 'All') || demand[0] || {};
  const payload = {
    productName: product.name,
    category: product.category,
    brand: product.brand,
    region: product.region,
    demandScore: overall.currentScore || 0,
    growthPercent: overall.growthPercent || 0,
    trend: overall.trend || 'stable',
    counts: overall.counts || {},
    competition: product.competition,
    interestCount: product.interestCount,
    regions: demand
      .filter((d) => d.region !== 'All')
      .map((d) => ({
        region: d.region,
        currentScore: d.currentScore,
        growthPercent: d.growthPercent,
      })),
    note: 'All figures are observed MarketSignal platform signals (demo/sample data possible).',
  };

  const content = await geminiService.explainTrend(payload, {
    productId: product._id,
    userId: req.user._id,
  });
  res.json({ success: true, data: content });
});

exports.marketReport = asyncHandler(async (req, res) => {
  const [opportunities, regions, categories] = await Promise.all([
    opportunityRows(10),
    regionalDemand(),
    categoryDemand(),
  ]);
  const topRising = opportunities
    .filter((o) => o.growthPercent >= 25)
    .map((o) => ({
      name: o.product.name,
      demandScore: o.demandScore,
      growthPercent: o.growthPercent,
      competition: o.competition,
    }));

  const seller = await Seller.findOne({ user: req.user._id });
  const payload = {
    topRising,
    regions,
    categories,
    opportunities: opportunities.map((o) => ({
      name: o.product.name,
      insight: o.insight,
      competition: o.competition,
    })),
    note: 'Backend-computed metrics only. Demo catalog may be synthetic.',
  };

  const content = await geminiService.generateMarketReport(payload, {
    sellerId: seller?._id,
    userId: req.user._id,
  });
  res.json({ success: true, data: content });
});

exports.chat = asyncHandler(async (req, res) => {
  const question = typeof req.body.question === 'string' ? req.body.question.trim() : '';
  if (!question) {
    const error = new Error('Question is required');
    error.statusCode = 400;
    throw error;
  }
  if (question.length > 500) {
    const error = new Error('Question must be 500 characters or fewer');
    error.statusCode = 400;
    throw error;
  }

  const q = question.toLowerCase();
  const [opportunities, regions, categories] = await Promise.all([
    opportunityRows(15),
    regionalDemand(),
    categoryDemand(),
  ]);

  let filtered = opportunities;
  const regionMatch = regions.find((r) => q.includes(r._id.toLowerCase()));
  if (regionMatch) {
    const demand = await DemandSignal.find({ region: regionMatch._id })
      .sort({ growthPercent: -1 })
      .limit(10)
      .populate('productId', 'name category competition');
    filtered = demand.filter((d) => d.productId).map((d) => ({
      product: d.productId,
      demandScore: d.currentScore,
      growthPercent: d.growthPercent,
      competition: d.productId.competition,
      insight: 'Regional observed demand',
    }));
  }

  if (q.includes('low competition') || q.includes('relatively low')) {
    filtered = filtered.filter((item) => item.competition === 'low');
  }
  if (q.includes('categor')) {
    filtered = categories.slice(0, 8).map((c) => ({
      product: { name: c.category },
      demandScore: c.demandScore,
      growthPercent: c.avgGrowth,
      competition: 'n/a',
      insight: 'Category demand',
    }));
  }

  const structured = {
    summary: filtered.length
      ? filtered
          .slice(0, 6)
          .map(
            (item) =>
              `${item.product.name}: demand ${item.demandScore}, growth ${item.growthPercent}%, ${item.insight}`
          )
          .join(' | ')
      : 'No matching platform records for those filters.',
    items: filtered.slice(0, 8).map((item) => ({
      productName: item.product.name,
      category: item.product.category,
      region: item.product.region,
      demandScore: item.demandScore,
      growthPercent: item.growthPercent,
      competition: item.competition,
      insight: item.insight,
    })),
    regions,
    categories: categories.slice(0, 8),
    note: 'Use only these MarketSignal platform records. Catalog and signals may be synthetic demo data; do not present them as real-world market facts.',
  };

  const seller = await Seller.findOne({ user: req.user._id });
  const content = await geminiService.chatAboutMarket(question, structured, {
    userId: req.user._id,
    sellerId: seller?._id,
  });
  res.json({ success: true, data: content });
});
