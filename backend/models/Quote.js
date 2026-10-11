const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offeredPricePerKg: {
      type: Number,
      required: [true, 'Please provide price per KG']
    },
    totalOfferedPrice: {
      type: Number,
      required: [true, 'Please provide total offered amount']
    },
    message: {
      type: String,
      default: ''
    },
    pickupDate: {
      type: Date,
      required: [true, 'Please provide estimated pickup date']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);