const express = require('express');
const controller = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', controller.listProducts);
router.get('/categories/list', controller.listCategories);
router.get('/:id', controller.getProduct);
router.post('/', protect, authorize('seller', 'admin'), upload.single('image'), controller.createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.single('image'), controller.updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), controller.deleteProduct);

module.exports = router;
