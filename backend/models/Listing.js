const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide listing title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select material category'],
      enum: [
        'PCB Boards',
        'Batteries (Li-ion/Lead)',
        'Wires & Copper Cables',
        'Mobile Phones & Chargers',
        'Laptops & Computers',
        'Mixed E-Waste',
        'Screens & Displays'
      ]
    },
    estimatedWeight: {
      type: Number,
      required: [true, 'Please provide estimated weight in KG']
    },
    condition: {
      type: String,
      enum: ['Scrap/Damaged', 'Working', 'Semi-Working', 'Mixed'],
      default: 'Scrap/Damaged'
    },
    referencePricePerKg: {
      type: Number,
      default: 0
    },
    estimatedTotalValue: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
    },
    images: [
      {
        type: String,
        default: 'https://placehold.co/400x300?text=E-Waste+Material'
      }
    ],
    pickupAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ['pending', 'quoted', 'accepted', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);