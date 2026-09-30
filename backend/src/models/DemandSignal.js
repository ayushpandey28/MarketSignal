const mongoose = require('mongoose');

const demandSignalSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    region: { type: String, default: 'All', index: true },
    currentScore: { type: Number, default: 0 },
    previousScore: { type: Number, default: 0 },
    growthPercent: { type: Number, default: 0 },
    trend: { type: String, enum: ['rising', 'stable', 'declining'], default: 'stable', index: true },
    counts: {
      search: { type: Number, default: 0 },
      view: { type: Number, default: 0 },
      wishlist: { type: Number, default: 0 },
      price_alert: { type: Number, default: 0 },
      interest: { type: Number, default: 0 },
    },
    periodStart: { type: Date },
    periodEnd: { type: Date },
  },
  { timestamps: true }
);

demandSignalSchema.index({ productId: 1, region: 1 }, { unique: true });

module.exports = mongoose.model('DemandSignal', demandSignalSchema);
