const express = require('express');
const controller = require('../controllers/demandController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/trending', controller.trending);
router.get('/regions', controller.regions);
router.get('/categories', controller.categories);
router.get('/timeline', controller.timeline);
router.post('/recalculate', protect, authorize('admin'), controller.recalculate);
router.get('/:productId', controller.productDemand);

module.exports = router;
