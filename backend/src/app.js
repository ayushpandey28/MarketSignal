const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = [
  process.env.FRONTEND_URL && process.env.FRONTEND_URL.replace(/\/+$/, ''),
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://market-signal-twentyeight.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);

      try {
        const url = new URL(cleanOrigin);
        if (url.hostname.endsWith('.vercel.app')) {
          return callback(null, true);
        }
      } catch {
        // ignore invalid URL
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api', async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/demand', demandRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
