const Listing = require('../models/Listing');
const Quote = require('../models/Quote');
const Transaction = require('../models/Transaction');

// Reference rates standard definition
const referenceRates = {
  'PCB Boards': 150,
  'Batteries (Li-ion/Lead)': 85,
  'Wires & Copper Cables': 320,
  'Mobile Phones & Chargers': 110,
  'Laptops & Computers': 200,
  'Mixed E-Waste': 45,
  'Screens & Displays': 60
};

// @desc Create new e-waste listing
// @route POST /api/collector/listing
exports.createListing = async (req, res) => {
  try {
    const { title, category, estimatedWeight, condition, description, pickupAddress, images } = req.body;

    const rate = referenceRates[category] || 50;
    const estimatedTotal = Number(estimatedWeight) * rate;

    const listing = await Listing.create({
      collector: req.user._id,
      title,
      category,
      estimatedWeight,
      condition,
      referencePricePerKg: rate,
      estimatedTotalValue: estimatedTotal,
      description,
      pickupAddress,
      images: images && images.length > 0 ? images : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Material listed successfully',
      data: listing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get collector's own listings
// @route GET /api/collector/listings
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ collector: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single listing with all quotations
// @route GET /api/collector/listing/:id
exports.getListingDetails = async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, collector: req.user._id });
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const quotes = await Quote.find({ listing: req.params.id }).populate('recycler', 'name email phone recyclerDetails isVerified');

    res.status(200).json({
      success: true,
      data: { listing, quotes }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Accept a recycler quote
// @route POST /api/collector/quote/:id/accept
exports.acceptQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('listing');
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    // Verify collector owns this listing
    if (quote.listing.collector.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to accept this quote' });
    }

    // Update chosen quote to accepted
    quote.status = 'accepted';
    await quote.save();

    // Reject all other quotes for this listing
    await Quote.updateMany(
      { listing: quote.listing._id, _id: { $ne: quote._id } },
      { status: 'rejected' }
    );

    // Update listing status
    await Listing.findByIdAndUpdate(quote.listing._id, { status: 'accepted' });

    // Generate unique Receipt ID
    const receiptId = `REC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Initial Transaction record
    const transaction = await Transaction.create({
      receiptId,
      listing: quote.listing._id,
      quote: quote._id,
      collector: req.user._id,
      recycler: quote.recycler,
      finalRatePerKg: quote.offeredPricePerKg,
      transactionStatus: 'scheduled'
    });

    res.status(200).json({
      success: true,
      message: 'Quote accepted successfully & Transaction created',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get collector transactions
// @route GET /api/collector/transactions
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ collector: req.user._id })
      .populate('listing', 'title category estimatedWeight')
      .populate('recycler', 'name email phone recyclerDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};