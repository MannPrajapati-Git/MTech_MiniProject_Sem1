const Listing = require('../models/Listing');
const Quote = require('../models/Quote');
const Transaction = require('../models/Transaction');

// @desc Get listings available for bidding
// @route GET /api/recycler/listings
exports.getAvailableListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: { $in: ['pending', 'quoted'] } })
      .populate('collector', 'name phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit quotation for a listing
// @route POST /api/recycler/quote
exports.submitQuote = async (req, res) => {
  try {
    const { listingId, offeredPricePerKg, message, pickupDate } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.status === 'accepted' || listing.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Listing is no longer accepting quotations' });
    }

    // Check if recycler already submitted a quote for this listing
    const existingQuote = await Quote.findOne({ listing: listingId, recycler: req.user._id });
    if (existingQuote) {
      return res.status(400).json({ success: false, message: 'You have already submitted an offer for this listing' });
    }

    const totalOfferedPrice = Number(offeredPricePerKg) * listing.estimatedWeight;

    const quote = await Quote.create({
      listing: listingId,
      recycler: req.user._id,
      offeredPricePerKg,
      totalOfferedPrice,
      message,
      pickupDate
    });

    // Mark listing status as quoted
    listing.status = 'quoted';
    await listing.save();

    res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully',
      data: quote
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get recycler's submitted quotes
// @route GET /api/recycler/quotes
exports.getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ recycler: req.user._id })
      .populate('listing')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get pickups / accepted deals
// @route GET /api/recycler/pickups
exports.getMyPickups = async (req, res) => {
  try {
    const transactions = await Transaction.find({ recycler: req.user._id })
      .populate('listing')
      .populate('collector', 'name phone address')
      .populate('quote')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify actual weight on pickup and finalize deal amount
// @route PUT /api/recycler/transaction/:id/verify
exports.verifyHandover = async (req, res) => {
  try {
    const { verifiedWeight, paymentStatus, notes } = req.body;

    const transaction = await Transaction.findOne({ _id: req.params.id, recycler: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const finalAmount = Number(verifiedWeight) * transaction.finalRatePerKg;

    transaction.verifiedWeight = verifiedWeight;
    transaction.finalAmount = finalAmount;
    transaction.transactionStatus = 'completed';
    transaction.paymentStatus = paymentStatus || 'completed';
    if (notes) transaction.notes = notes;

    await transaction.save();

    // Mark original listing completed
    await Listing.findByIdAndUpdate(transaction.listing, { status: 'completed' });

    res.status(200).json({
      success: true,
      message: 'Material verified and transaction completed successfully',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};