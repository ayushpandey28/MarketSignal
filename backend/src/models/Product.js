const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: 'Generic' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    region: { type: String, default: 'United States', index: true },
    imageUrl: { type: String, default: '' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    interestCount: { type: Number, default: 0 },
    competition: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
