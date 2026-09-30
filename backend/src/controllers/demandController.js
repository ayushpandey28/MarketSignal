const mongoose = require('mongoose');
const DemandSignal = require('../models/DemandSignal');
const { getTrending, getProductDemand } = require('../services/trendEngine');
const { regionalDemand, categoryDemand, demandOverTime } = require('../services/marketAnalytics');
const { refreshAllDemand } = require('../services/demandEngine');
const { asyncHandler } = require('../middleware/errorMiddleware');

exports.trending = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 10);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    const error = new Error('Limit must be between 1 and 50');
    error.statusCode = 400;
    throw error;
  }
  if (req.query.trend && !['rising', 'stable', 'declining'].includes(req.query.trend)) {
    const error = new Error('Invalid trend');
    error.statusCode = 400;
    throw error;
  }

  const rows = await getTrending({ limit, trend: req.query.trend });
  const data = rows
    .filter((row) => row.productId)
    .map((row) => ({
      product: row.productId,
      demandScore: row.currentScore,
      previousScore: row.previousScore,
      growthPercent: row.growthPercent,
      trend: row.trend,
      counts: row.counts,
    }));
  res.json({ success: true, data });
});

exports.productDemand = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    const error = new Error('Invalid product ID');
    error.statusCode = 400;
    throw error;
  }
  const data = await getProductDemand(req.params.productId);
  res.json({ success: true, data });
});

exports.regions = asyncHandler(async (req, res) => {
  const data = await regionalDemand();
  res.json({ success: true, data });
});

exports.categories = asyncHandler(async (req, res) => {
  const data = await categoryDemand();
  res.json({ success: true, data });
});

exports.timeline = asyncHandler(async (req, res) => {
  const days = Number(req.query.days || 14);
  if (!Number.isInteger(days) || days < 1 || days > 90) {
    const error = new Error('Days must be between 1 and 90');
    error.statusCode = 400;
    throw error;
  }
  if (req.query.productId && !mongoose.isValidObjectId(req.query.productId)) {
    const error = new Error('Invalid product ID');
    error.statusCode = 400;
    throw error;
  }

  const data = await demandOverTime(req.query.productId, days);
  res.json({ success: true, data });
});

exports.recalculate = asyncHandler(async (req, res) => {
  await refreshAllDemand();
  const count = await DemandSignal.countDocuments();
  res.json({ success: true, data: { updated: count } });
});
