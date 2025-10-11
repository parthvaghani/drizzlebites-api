// const mongoose = require('mongoose');

// const CouponSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     code: { type: String, required: true, unique: true, uppercase: true },
//     description: { type: String },
//     type: { type: String, enum: ['order', 'product'], required: true },
//     uniqueType: { type: String, enum: ['unique', 'generic'], default: 'generic' },
//     userType: { type: String, enum: ['unique', 'generic'], default: 'generic' },
//     minOrderQty: { type: Number },
//     minCartValue: { type: Number },
//     maxDiscountValue: { type: Number },
//     startDate: { type: Date, required: true },
//     expiryDate: { type: Date, required: true },
//     maxUsage: { type: Number, default: 1 },
//     terms: { type: String },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Coupon', CouponSchema);

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    termsAndConditions: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    level: {
      type: String,
      enum: ['order', 'product'],
      required: true,
    },
    minOrderQuantity: {
      type: Number,
      default: 0,
    },
    minCartValue: {
      type: Number,
      default: 0,
    },
    maxDiscountValue: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['unique', 'generic'],
      required: true,
    },
    userType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    //   required: true,
    },
    maxUsage: {
      type: Number,
      default: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
