const express = require('express');
const controller = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/users', controller.users);
router.get('/sellers', controller.sellers);
router.get('/products', controller.products);
router.get('/signals', controller.signals);
router.get('/analytics', controller.analytics);
router.get('/categories', controller.categories);
router.post('/categories', controller.addCategory);
router.patch('/users/:id/toggle', controller.toggleUser);

module.exports = router;
