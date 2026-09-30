const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    type: {
      type: String,
      enum: ['search', 'view', 'wishlist', 'price_alert', 'interest'],
      required: true,
      index: true,
    },
    region: { type: String, default: 'United States', index: true },
    query: { type: String, default: '' },
  },
  { timestamps: true }
);

signalSchema.index({ userId: 1, productId: 1, type: 1, createdAt: -1 });
signalSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Signal', signalSchema);
