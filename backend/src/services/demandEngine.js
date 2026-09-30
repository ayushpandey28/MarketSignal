const Signal = require('../models/Signal');
const DemandSignal = require('../models/DemandSignal');
const Product = require('../models/Product');
const {
  PERIOD_DAYS,
  SIGNAL_COOLDOWN_MS,
  calculateDemandScore,
  getTrendStatus,
} = require('../utils/calculateDemandScore');
const { calculateGrowth } = require('../utils/calculateGrowth');

function periodRange(days = PERIOD_DAYS) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const prevStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end, prevStart };
}

function emptyCounts() {
  return { search: 0, view: 0, wishlist: 0, price_alert: 0, interest: 0 };
}

function countsFromDocs(docs) {
  const counts = emptyCounts();
  docs.forEach((doc) => {
    if (counts[doc._id] !== undefined) counts[doc._id] = doc.total;
  });
  return counts;
}

async function canRecordSignal({ userId, productId, type }) {
  const cooldown = SIGNAL_COOLDOWN_MS[type];
  if (!cooldown || !userId) return true;

  const since = new Date(Date.now() - cooldown);
  const filter = { userId, type, createdAt: { $gte: since } };
  if (productId) filter.productId = productId;

  const existing = await Signal.findOne(filter).select('_id');
  return !existing;
}

async function recordSignal({ userId, productId, type, region, query }) {
  const allowed = await canRecordSignal({ userId, productId, type });
  if (!allowed) {
    return { created: false, reason: 'rate_limited' };
  }

  const signal = await Signal.create({
    userId: userId || undefined,
    productId: productId || undefined,
    type,
    region: region || 'United States',
    query: query || '',
  });

  if (productId) {
    await refreshProductDemand(productId);
  }

  return { created: true, signal };
}

async function aggregateCounts(productId, region, from, to) {
  const match = {
    productId,
    createdAt: { $gte: from, $lt: to },
  };
  if (region && region !== 'All') match.region = region;

  const docs = await Signal.aggregate([
    { $match: match },
    { $group: { _id: '$type', total: { $sum: 1 } } },
  ]);
  return countsFromDocs(docs);
}

async function refreshProductDemand(productId) {
  const product = await Product.findById(productId);
  if (!product) return null;

  const { start, end, prevStart } = periodRange();
  const signalRegions = await Signal.distinct('region', {
    productId,
    createdAt: { $gte: prevStart, $lt: end },
  });
  const regions = ['All', ...new Set([product.region, ...signalRegions])];
  await DemandSignal.deleteMany({ productId, region: { $nin: regions } });

  let overall = null;
  for (const region of regions) {
    const currentCounts = await aggregateCounts(productId, region === 'All' ? null : region, start, end);
    const previousCounts = await aggregateCounts(productId, region === 'All' ? null : region, prevStart, start);
    const currentScore = calculateDemandScore(currentCounts);
    const previousScore = calculateDemandScore(previousCounts);
    const growthPercent = calculateGrowth(currentScore, previousScore);
    const trend = getTrendStatus(growthPercent);

    const record = await DemandSignal.findOneAndUpdate(
      { productId, region },
      {
        currentScore,
        previousScore,
        growthPercent,
        trend,
        counts: currentCounts,
        periodStart: start,
        periodEnd: end,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (region === 'All') overall = record;
  }

  return overall;
}

async function refreshAllDemand() {
  const products = await Product.find({ isActive: true }).select('_id');
  for (const product of products) {
    await refreshProductDemand(product._id);
  }
}

module.exports = {
  recordSignal,
  canRecordSignal,
  refreshProductDemand,
  refreshAllDemand,
  periodRange,
};
