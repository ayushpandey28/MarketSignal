const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    targetPrice: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    triggeredAt: { type: Date },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

priceAlertSchema.index({ userId: 1, productId: 1, active: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
