const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  verifyRecycler,
  getAllListings,
  getAllTransactions,
  getPlatformStats
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Admin routes require authentication & role 'admin'
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.put('/verify-recycler/:id', verifyRecycler);
router.get('/listings', getAllListings);
router.get('/transactions', getAllTransactions);
router.get('/stats', getPlatformStats);

module.exports = router;