const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    receiptId: {
      type: String,
      required: true,
      unique: true
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      required: true
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    verifiedWeight: {
      type: Number,
      default: null
    },
    finalRatePerKg: {
      type: Number,
      required: true
    },
    finalAmount: {
      type: Number,
      default: null
    },
    transactionStatus: {
      type: String,
      enum: ['scheduled', 'picked_up', 'verified', 'completed'],
      default: 'scheduled'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);