const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

inventorySchema.index({ sellerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
