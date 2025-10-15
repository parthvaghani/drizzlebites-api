const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }]
  },
  { timestamps: true },
);

// Add indexes for better search performance
bulkOrderSchema.index({ fullName: 'text', emailAddress: 'text', deliveryAddress: 'text' });
bulkOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
