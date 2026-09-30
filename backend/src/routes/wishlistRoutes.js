const express = require('express');
const controller = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', controller.list);
router.post('/', controller.add);
router.delete('/:id', controller.remove);

module.exports = router;
