const Signal = require('../models/Signal');
const DemandSignal = require('../models/DemandSignal');
const Product = require('../models/Product');
const { periodRange } = require('./demandEngine');

async function demandOverTime(productId, days = 14) {
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const match = { createdAt: { $gte: start } };
  if (productId) match.productId = productId;

  return Signal.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

async function regionalDemand() {
  return DemandSignal.aggregate([
    { $match: { region: { $ne: 'All' } } },
    {
      $lookup: {
        from: Product.collection.name,
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    { $match: { 'product.isActive': true } },
    {
      $group: {
        _id: '$region',
        demandScore: { $sum: '$currentScore' },
        avgGrowth: { $avg: '$growthPercent' },
      },
    },
    { $sort: { demandScore: -1 } },
  ]);
}

async function categoryDemand() {
  const rows = await DemandSignal.find({ region: 'All' }).populate('productId', 'category isActive');
  const map = {};
  rows.forEach((row) => {
    if (!row.productId || !row.productId.isActive) return;
    const category = row.productId.category;
    if (!map[category]) {
      map[category] = { category, demandScore: 0, growth: 0, count: 0 };
    }
    map[category].demandScore += row.currentScore;
    map[category].growth += row.growthPercent;
    map[category].count += 1;
  });
  return Object.values(map)
    .map((item) => ({
      ...item,
      avgGrowth: item.count ? Number((item.growth / item.count).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.demandScore - a.demandScore);
}

async function risingCategories() {
  const categories = await categoryDemand();
  return categories.filter((item) => item.avgGrowth >= 25).slice(0, 8);
}

async function competitionLabel(score) {
  if (score >= 80) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

async function opportunityRows(limit = 12) {
  const rows = await DemandSignal.find({ region: 'All' })
    .sort({ growthPercent: -1, currentScore: -1 })
    .limit(40)
    .populate({ path: 'productId', match: { isActive: true } });

  return rows
    .filter((row) => row.productId)
    .map((row) => {
      const demand = row.currentScore;
      const growth = row.growthPercent;
      const competition = row.productId.competition;
      let insight = 'Opportunity worth investigating';
      if (growth >= 25 && competition === 'low') insight = 'Strong demand signal with relatively low competition';
      else if (growth >= 25) insight = 'Emerging interest';
      else if (growth > 0) insight = 'Increasing interest';
      else if (competition === 'high') insight = 'High competition';

      return {
        product: row.productId,
        demandScore: demand,
        growthPercent: growth,
        trend: row.trend,
        competition,
        insight,
      };
    })
    .sort((a, b) => b.demandScore - a.demandScore || b.growthPercent - a.growthPercent)
    .slice(0, limit);
}

async function recentSignals(limit = 12) {
  return Signal.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('productId', 'name category region')
    .populate('userId', 'name role');
}

async function periodSignalCount() {
  const { start } = periodRange();
  return Signal.countDocuments({ createdAt: { $gte: start } });
}

async function productCountByCategory() {
  return Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

module.exports = {
  demandOverTime,
  regionalDemand,
  categoryDemand,
  risingCategories,
  competitionLabel,
  opportunityRows,
  recentSignals,
  periodSignalCount,
  productCountByCategory,
};
