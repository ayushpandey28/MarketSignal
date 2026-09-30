require('dotenv').config();
const mongoose = require('mongoose');
const { connectDb } = require('../config/db');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Signal = require('../models/Signal');
const Wishlist = require('../models/Wishlist');
const PriceAlert = require('../models/PriceAlert');
const DemandSignal = require('../models/DemandSignal');
const AIReport = require('../models/AIReport');
const { productDocs, REGIONS } = require('./seedProducts');
const { refreshAllDemand } = require('../services/demandEngine');

const TYPES = ['search', 'view', 'wishlist', 'price_alert', 'interest'];

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function seed() {
  await connectDb();
  await Promise.all([
    User.deleteMany({}),
    Seller.deleteMany({}),
    Product.deleteMany({}),
    Inventory.deleteMany({}),
    Signal.deleteMany({}),
    Wishlist.deleteMany({}),
    PriceAlert.deleteMany({}),
    DemandSignal.deleteMany({}),
    AIReport.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Ada Admin',
    email: 'admin@marketsignal.demo',
    password: 'Password123',
    role: 'admin',
    region: 'United States',
  });
  const sellerUser = await User.create({
    name: 'Sam Seller',
    email: 'seller@marketsignal.demo',
    password: 'Password123',
    role: 'seller',
    region: 'Germany',
  });
  const consumer = await User.create({
    name: 'Casey Consumer',
    email: 'consumer@marketsignal.demo',
    password: 'Password123',
    role: 'consumer',
    region: 'United States',
  });

  const extraConsumers = [];
  for (const [i, name] of ['Alex', 'Blair', 'Drew', 'Eden', 'Finn'].entries()) {
    extraConsumers.push(
      await User.create({
        name: `${name} Shopper`,
        email: `${name.toLowerCase()}@marketsignal.demo`,
        password: 'Password123',
        role: 'consumer',
        region: REGIONS[i % REGIONS.length],
      })
    );
  }

  const seller = await Seller.create({
    user: sellerUser._id,
    companyName: 'Northwind Gadgets (sample)',
    region: 'Germany',
    bio: 'Demo seller used for MarketSignal sample inventory.',
  });

  const products = await Product.insertMany(productDocs(seller._id));
  await Inventory.insertMany(
    products.map((product) => ({
      sellerId: seller._id,
      productId: product._id,
      stock: product.stock,
      price: product.price,
    }))
  );

  const users = [consumer, ...extraConsumers];
  const signals = [];

  products.forEach((product, index) => {
    const risingBoost = index < 8 ? 18 : index < 18 ? 8 : 3;
    TYPES.forEach((type) => {
      const count = risingBoost + (type === 'view' ? 10 : 2);
      for (let i = 0; i < count; i += 1) {
        const user = users[i % users.length];
        const inCurrent = i % 3 !== 0;
        signals.push({
          userId: user._id,
          productId: product._id,
          type,
          region: i % 2 === 0 ? product.region : REGIONS[i % REGIONS.length],
          createdAt: daysAgo(inCurrent ? i % 6 : 8 + (i % 5)),
        });
      }
    });
  });

  await Signal.insertMany(signals);

  await Wishlist.insertMany(
    products.slice(0, 6).map((product) => ({
      userId: consumer._id,
      productId: product._id,
    }))
  );

  await PriceAlert.insertMany([
    { userId: consumer._id, productId: products[0]._id, targetPrice: 199, active: true },
    { userId: consumer._id, productId: products[2]._id, targetPrice: 150, active: true },
  ]);

  for (const [i, product] of products.entries()) {
    product.interestCount = 18 + ((i * 7) % 40);
    await product.save();
  }

  await refreshAllDemand();

  console.log('Seed complete.');
  console.log('Demo logins (password: Password123):');
  console.log('  admin@marketsignal.demo');
  console.log('  seller@marketsignal.demo');
  console.log('  consumer@marketsignal.demo');
  console.log(`Users: ${admin.email}, products: ${products.length}`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect();
  process.exit(1);
});
