function calculateGrowth(current, previous) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

module.exports = { calculateGrowth };
