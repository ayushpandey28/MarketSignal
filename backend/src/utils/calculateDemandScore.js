const SIGNAL_WEIGHTS = {
  search: 1,
  view: 2,
  wishlist: 4,
  price_alert: 5,
  interest: 7,
};

const TREND_THRESHOLDS = {
  rising: 25,
  declining: -25,
};

const PERIOD_DAYS = 7;
const SIGNAL_COOLDOWN_MS = {
  search: 2 * 60 * 1000,
  view: 30 * 60 * 1000,
  wishlist: 24 * 60 * 60 * 1000,
  price_alert: 24 * 60 * 60 * 1000,
  interest: 7 * 24 * 60 * 60 * 1000,
};

function getWeight(type) {
  return SIGNAL_WEIGHTS[type] || 0;
}

function calculateDemandScore(counts) {
  return (
    (counts.search || 0) * SIGNAL_WEIGHTS.search +
    (counts.view || 0) * SIGNAL_WEIGHTS.view +
    (counts.wishlist || 0) * SIGNAL_WEIGHTS.wishlist +
    (counts.price_alert || 0) * SIGNAL_WEIGHTS.price_alert +
    (counts.interest || 0) * SIGNAL_WEIGHTS.interest
  );
}

function getTrendStatus(growthPercent) {
  if (growthPercent >= TREND_THRESHOLDS.rising) return 'rising';
  if (growthPercent <= TREND_THRESHOLDS.declining) return 'declining';
  return 'stable';
}

module.exports = {
  SIGNAL_WEIGHTS,
  TREND_THRESHOLDS,
  PERIOD_DAYS,
  SIGNAL_COOLDOWN_MS,
  getWeight,
  calculateDemandScore,
  getTrendStatus,
};
