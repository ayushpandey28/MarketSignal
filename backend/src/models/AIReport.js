const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['trend', 'market', 'chat'], required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    promptHash: { type: String, index: true },
    inputSnapshot: { type: Object, default: {} },
    content: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIReport', aiReportSchema);
