const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();
const aiLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.use(protect, aiLimit);
router.post('/explain-trend', controller.explainTrend);
router.post('/market-report', authorize('seller', 'admin'), controller.marketReport);
router.post('/chat', controller.chat);

module.exports = router;
