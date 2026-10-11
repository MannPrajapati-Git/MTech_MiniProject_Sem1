const express = require('express');
const router = express.Router();
const {
  createListing,
  getMyListings,
  getListingDetails,
  acceptQuote,
  getMyTransactions
} = require('../controllers/collectorController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Collector routes require authentication & role 'collector'
router.use(protect);
router.use(authorizeRoles('collector'));

router.post('/listing', createListing);
router.get('/listings', getMyListings);
router.get('/listing/:id', getListingDetails);
router.post('/quote/:id/accept', acceptQuote);
router.get('/transactions', getMyTransactions);

module.exports = router;