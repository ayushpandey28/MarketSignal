const express = require('express');
const controller = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('seller', 'admin'));
router.get('/dashboard', controller.dashboard);
router.get('/opportunities', controller.opportunities);
router.get('/analytics', controller.analytics);
router.get('/inventory', controller.inventory);
router.get('/products', controller.myProducts);

module.exports = router;
