const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    region: { type: String, default: 'United States' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
