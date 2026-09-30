const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/signalController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const signalLimit = rateLimit({ windowMs: 60 * 1000, max: 40 });

router.get('/interests', protect, controller.myInterests);
router.post('/search', signalLimit, optionalAuth, controller.searchSignal);
router.post('/view', signalLimit, optionalAuth, controller.viewSignal);
router.post('/interest', signalLimit, protect, controller.interestSignal);

module.exports = router;
