const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 40 });

router.post('/register', authLimit, controller.register);
router.post('/login', authLimit, controller.login);
router.post('/forgot-password', authLimit, controller.forgotPassword);
router.post('/reset-password', authLimit, controller.resetPassword);
router.get('/me', protect, controller.me);
router.put('/me', protect, controller.updateProfile);

module.exports = router;
