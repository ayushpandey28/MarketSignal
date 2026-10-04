const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const signalRoutes = require('./routes/signalRoutes');
const demandRoutes = require('./routes/demandRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const alertRoutes = require('./routes/alertRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { connectDb } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.set('trust proxy', 1);

// =========================
// CORS CONFIGURATION
// =========================

const allowedOrigins = [
  process.env.FRONTEND_URL &&
    process.env.FRONTEND_URL.replace(/\/+$/, ''),

  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',

  'https://market-signal-twentyeight.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/+$/, '');

      // Allow known origins
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      try {
        const url = new URL(cleanOrigin);

        if (url.hostname.endsWith('.vercel.app')) {
          return callback(null, true);
        }
      } catch (error) {
        // Invalid origin
      }

      return callback(
        new Error('Origin is not allowed by CORS')
      );
    },

    credentials: true,
  })
);

// =========================
// BODY PARSING
// =========================

app.use(express.json({ limit: '1mb' }));

// =========================
// HEALTH CHECK
// =========================

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
    },
  });
});

// =========================
// DATABASE CONNECTION
// =========================

app.use('/api', async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    next(error);
  }
});

// =========================
// API ROUTES
// =========================

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/signals', signalRoutes);

app.use('/api/demand', demandRoutes);

app.use('/api/wishlist', wishlistRoutes);

app.use('/api/alerts', alertRoutes);

app.use('/api/seller', sellerRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/admin', adminRoutes);

// =========================
// ERROR HANDLING
// =========================

app.use(notFound);

app.use(errorHandler);

module.exports = app;