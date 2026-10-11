const User = require('../models/User');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');

// @desc Get all users with filter
// @route GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify or Revoke Recycler
// @route PUT /api/admin/verify-recycler/:id
exports.verifyRecycler = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'recycler') {
      return res.status(404).json({ success: false, message: 'Recycler not found' });
    }

    user.isVerified = isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Recycler verification status updated to ${isVerified}`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all listings on platform
// @route GET /api/admin/listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('collector', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all platform transactions
// @route GET /api/admin/transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('collector', 'name email phone')
      .populate('recycler', 'name email phone recyclerDetails')
      .populate('listing', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Platform Overall Stats
// @route GET /api/admin/stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalCollectors = await User.countDocuments({ role: 'collector' });
    const totalRecyclers = await User.countDocuments({ role: 'recycler' });
    const totalListings = await Listing.countDocuments();
    const completedTransactions = await Transaction.find({ transactionStatus: 'completed' });

    const totalWeightRecycled = completedTransactions.reduce(
      (sum, item) => sum + (item.verifiedWeight || 0),
      0
    );

    const totalTransactionVolume = completedTransactions.reduce(
      (sum, item) => sum + (item.finalAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalCollectors,
        totalRecyclers,
        totalListings,
        completedTransactionsCount: completedTransactions.length,
        totalWeightRecycledKg: totalWeightRecycled,
        totalTransactionVolumeINR: totalTransactionVolume
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};