const DemandSignal = require('../models/DemandSignal');
const { getTrendStatus } = require('../utils/calculateDemandScore');
const { calculateGrowth } = require('../utils/calculateGrowth');

function classifyTrend(growthPercent) {
  return getTrendStatus(growthPercent);
}

async function getTrending({ limit = 8, trend } = {}) {
  const filter = { region: 'All' };
  if (trend) filter.trend = trend;

  return DemandSignal.find(filter)
    .sort({ growthPercent: -1, currentScore: -1 })
    .limit(Number(limit))
    .populate({
      path: 'productId',
      match: { isActive: true },
    });
}

async function getProductDemand(productId) {
  return DemandSignal.find({ productId }).sort({ region: 1 });
}

module.exports = {
  classifyTrend,
  getTrending,
  getProductDemand,
  calculateGrowth,
};
