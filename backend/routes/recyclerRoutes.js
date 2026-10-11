const express = require('express');
const router = express.Router();
const {
  getAvailableListings,
  submitQuote,
  getMyQuotes,
  getMyPickups,
  verifyHandover
} = require('../controllers/recyclerController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Recycler routes require authentication & role 'recycler'
router.use(protect);
router.use(authorizeRoles('recycler'));

router.get('/listings', getAvailableListings);
router.post('/quote', submitQuote);
router.get('/quotes', getMyQuotes);
router.get('/pickups', getMyPickups);
router.put('/transaction/:id/verify', verifyHandover);

module.exports = router;