const mongoose = require('mongoose');

const Product = require('../models/Product');
const Seller = require('../models/Seller');
const Inventory = require('../models/Inventory');
const Wishlist = require('../models/Wishlist');
const PriceAlert = require('../models/PriceAlert');
const DemandSignal = require('../models/DemandSignal');

const { asyncHandler } = require('../middleware/errorMiddleware');
const { refreshProductDemand } = require('../services/demandEngine');

const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} = require('../config/cloudinary');

function validateProductId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid product ID');
    error.statusCode = 400;
    throw error;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function productFilter(query) {
  const filter = { isActive: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.region) {
    filter.region = query.region;
  }

  if (query.brand) {
    filter.brand = query.brand;
  }

  if (query.search !== undefined) {
    if (
      typeof query.search !== 'string' ||
      query.search.length > 100
    ) {
      const error = new Error(
        'Search must be 100 characters or fewer'
      );
      error.statusCode = 400;
      throw error;
    }

    const search = escapeRegExp(query.search.trim());

    filter.$or = [
      { name: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
    ];
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);

      if (
        !Number.isFinite(filter.price.$gte) ||
        filter.price.$gte < 0
      ) {
        const error = new Error(
          'Minimum price must be a valid non-negative number'
        );
        error.statusCode = 400;
        throw error;
      }
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);

      if (
        !Number.isFinite(filter.price.$lte) ||
        filter.price.$lte < 0
      ) {
        const error = new Error(
          'Maximum price must be a valid non-negative number'
        );
        error.statusCode = 400;
        throw error;
      }
    }

    if (
      filter.price.$gte !== undefined &&
      filter.price.$lte !== undefined &&
      filter.price.$gte > filter.price.$lte
    ) {
      const error = new Error(
        'Minimum price cannot exceed maximum price'
      );
      error.statusCode = 400;
      throw error;
    }
  }

  return filter;
}

exports.listProducts = asyncHandler(async (req, res) => {
  const filter = productFilter(req.query);

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(120);

  const ids = products.map((p) => p._id);

  const demand = await DemandSignal.find({
    productId: { $in: ids },
    region: 'All',
  });

  const demandMap = {};

  demand.forEach((d) => {
    demandMap[d.productId.toString()] = d;
  });

  const data = products.map((product) => {
    const d = demandMap[product._id.toString()];

    return {
      ...product.toObject(),
      demandScore: d?.currentScore || 0,
      growthPercent: d?.growthPercent || 0,
      trend: d?.trend || 'stable',
    };
  });

  res.json({
    success: true,
    data,
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  validateProductId(req.params.id);

  const product = await Product.findById(
    req.params.id
  ).populate('seller');

  if (!product || !product.isActive) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const demand = await DemandSignal.find({
    productId: product._id,
  });

  res.json({
    success: true,
    data: {
      product,
      demand,
    },
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({
    user: req.user._id,
  });

  if (!seller && req.user.role !== 'admin') {
    const error = new Error('Seller profile not found');
    error.statusCode = 400;
    throw error;
  }

  const name =
    typeof req.body.name === 'string'
      ? req.body.name.trim()
      : '';

  const category =
    typeof req.body.category === 'string'
      ? req.body.category.trim()
      : '';

  const price = Number(req.body.price);

  const stock =
    req.body.stock === undefined ||
    req.body.stock === ''
      ? 0
      : Number(req.body.stock);

  const competition =
    req.body.competition || 'medium';

  if (!name) {
    const error = new Error(
      'Product name is required'
    );
    error.statusCode = 400;
    throw error;
  }

  if (!category) {
    const error = new Error(
      'Category is required'
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    !['low', 'medium', 'high'].includes(
      competition
    )
  ) {
    const error = new Error(
      'Competition must be low, medium, or high'
    );
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isFinite(price) || price <= 0) {
    const error = new Error(
      'Price must be greater than 0'
    );
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isFinite(stock) || stock < 0) {
    const error = new Error(
      'Stock must be a non-negative number'
    );
    error.statusCode = 400;
    throw error;
  }

  // =========================
  // IMAGE UPLOAD
  // =========================

  let imageUrl = '';

  if (req.file) {
    if (!isCloudinaryConfigured()) {
      const error = new Error(
        'Cloudinary is not configured for image upload'
      );
      error.statusCode = 500;
      throw error;
    }

    imageUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      'marketsignal/products'
    );
  } else if (
    typeof req.body.imageUrl === 'string' &&
    req.body.imageUrl.trim()
  ) {
    imageUrl = req.body.imageUrl.trim();
  }

  // =========================
  // CREATE PRODUCT
  // =========================

  const payload = {
    name,
    description: req.body.description,
    category,
    brand: req.body.brand,
    price,
    stock,
    region: req.body.region || req.user.region,
    competition,
    seller: seller?._id,
    imageUrl,
    isDemo: false,
  };

  const product = await Product.create(
    payload
  );

  if (seller) {
    await Inventory.create({
      sellerId: seller._id,
      productId: product._id,
      stock: product.stock,
      price: product.price,
    });
  }

  await refreshProductDemand(product._id);

  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  validateProductId(req.params.id);

  const product = await Product.findById(
    req.params.id
  );

  if (!product) {
    const error = new Error(
      'Product not found'
    );
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role === 'seller') {
    const seller = await Seller.findOne({
      user: req.user._id,
    });

    if (
      !seller ||
      String(product.seller) !==
        String(seller._id)
    ) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  }

  const previousPrice = product.price;
  const previousRegion = product.region;

  if (
    req.body.name !== undefined &&
    (
      typeof req.body.name !== 'string' ||
      !req.body.name.trim()
    )
  ) {
    const error = new Error(
      'Product name is required'
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    req.body.category !== undefined &&
    (
      typeof req.body.category !== 'string' ||
      !req.body.category.trim()
    )
  ) {
    const error = new Error(
      'Category is required'
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    req.body.region !== undefined &&
    (
      typeof req.body.region !== 'string' ||
      !req.body.region.trim()
    )
  ) {
    const error = new Error(
      'Country/region is required'
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    req.body.competition !== undefined &&
    !['low', 'medium', 'high'].includes(
      req.body.competition
    )
  ) {
    const error = new Error(
      'Competition must be low, medium, or high'
    );
    error.statusCode = 400;
    throw error;
  }

  [
    'name',
    'description',
    'category',
    'brand',
    'region',
    'competition',
  ].forEach((key) => {
    if (req.body[key] !== undefined) {
      product[key] = req.body[key];
    }
  });

  if (req.body.price !== undefined) {
    const price = Number(req.body.price);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      const error = new Error(
        'Price must be greater than 0'
      );
      error.statusCode = 400;
      throw error;
    }

    product.price = price;
  }

  if (req.body.stock !== undefined) {
    const stock = Number(req.body.stock);

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      const error = new Error(
        'Stock must be a non-negative number'
      );
      error.statusCode = 400;
      throw error;
    }

    product.stock = stock;
  }

  // =========================
  // IMAGE UPDATE
  // =========================

  if (req.file) {
    if (!isCloudinaryConfigured()) {
      const error = new Error(
        'Cloudinary is not configured for image upload'
      );
      error.statusCode = 500;
      throw error;
    }

    product.imageUrl =
      await uploadBufferToCloudinary(
        req.file.buffer,
        'marketsignal/products'
      );
  } else if (
    req.body.imageUrl !== undefined &&
    typeof req.body.imageUrl === 'string'
  ) {
    product.imageUrl =
      req.body.imageUrl.trim();
  }

  await product.save();

  if (product.seller) {
    await Inventory.findOneAndUpdate(
      {
        productId: product._id,
      },
      {
        sellerId: product.seller,
        stock: product.stock,
        price: product.price,
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  if (product.price < previousPrice) {
    await PriceAlert.updateMany(
      {
        productId: product._id,
        active: true,
        targetPrice: {
          $gte: product.price,
        },
      },
      {
        active: false,
        notified: true,
        triggeredAt: new Date(),
      }
    );
  }

  if (product.region !== previousRegion) {
    await DemandSignal.deleteMany({
      productId: product._id,
      region: {
        $ne: 'All',
      },
    });

    await refreshProductDemand(
      product._id
    );
  }

  res.json({
    success: true,
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  validateProductId(req.params.id);

  const product = await Product.findById(
    req.params.id
  );

  if (!product) {
    const error = new Error(
      'Product not found'
    );
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role === 'seller') {
    const seller = await Seller.findOne({
      user: req.user._id,
    });

    if (
      !seller ||
      String(product.seller) !==
        String(seller._id)
    ) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
  }

  product.isActive = false;

  await product.save();

  await Promise.all([
    Inventory.deleteMany({
      productId: product._id,
    }),

    Wishlist.deleteMany({
      productId: product._id,
    }),

    DemandSignal.deleteMany({
      productId: product._id,
    }),

    PriceAlert.updateMany(
      {
        productId: product._id,
        active: true,
      },
      {
        active: false,
      }
    ),
  ]);

  res.json({
    success: true,
    message: 'Product removed',
  });
});

exports.listCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct(
    'category'
  );

  res.json({
    success: true,
    data: categories.sort(),
  });
});