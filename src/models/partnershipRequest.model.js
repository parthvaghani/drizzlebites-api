const mongoose = require('mongoose');

const partnershipRequestSchema = new mongoose.Schema(
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
    additionalInformation: {
      type: String,
      trim: true
    },
  },
  { timestamps: true },
);

// Add indexes for better search performance
partnershipRequestSchema.index({ fullName: 'text', emailAddress: 'text', additionalInformation: 'text' });
partnershipRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PartnershipRequest', partnershipRequestSchema);
