const Order = require('../models/order.model');
const Address = require('../models/address.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');

const createOrderFromCart = async ({ userId, addressId }) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  const cartItems = await Cart.find({ userId, isOrdered: false }).populate('productId');
  if (!cartItems || cartItems.length === 0) {
    const error = new Error('Cart is empty');
    error.statusCode = 400;
    throw error;
  }

  // Build productsDetails array using cart's weightVariant and weight, and product's variants for price/discount
  const productsDetails = cartItems.map((item) => {
    const product = item.productId;
    const weightVariant = item.weightVariant; // 'gm' or 'kg' from cart
    const weight = item.weight; // e.g. '200' or '1'
    let pricePerUnit = 0;
    let discount = 0;
    if (
      product &&
      product.variants &&
      product.variants[weightVariant] &&
      Array.isArray(product.variants[weightVariant])
    ) {
      const foundVariant = product.variants[weightVariant].find(
        (v) => v && v.weight && v.weight.toString() === weight.toString()
      );
      if (foundVariant) {
        pricePerUnit = typeof foundVariant.price === 'number' ? foundVariant.price : 0;
        discount = typeof foundVariant.discount === 'number' ? foundVariant.discount : 0;
      }
    }

    return {
      productId: product._id,
      weightVariant: weightVariant,
      weight: weight,
      pricePerUnit,
      discount,
      totalUnit: item.totalProduct,
    };
  });

  const user = await User.findById(userId).select('phoneNumber');
  const phoneNumber = user && user.phoneNumber ? user.phoneNumber : '';

  const orderDoc = await Order.create({
    userId,
    address: {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || 'IND',
    },
    productsDetails,
    phoneNumber,
  });

  await Cart.updateMany({ userId, isOrdered: false }, { $set: { isOrdered: true } });

  return orderDoc;
};

const getOrdersByUser = async (userId) => {
  return Order.find({ userId }).populate({ path: 'productsDetails.productId', select: 'name price images' });
};

const getOrderById = async (id, userId, role) => {
  const filter = role === 'admin' ? { _id: id } : { _id: id, userId };
  return Order.findOne(filter).populate({ path: 'productsDetails.productId', select: 'name price images' });
};

const cancelOrder = async (id, userId, reason, role) => {
  const filter = role === 'admin' ? { _id: id } : { _id: id, userId };
  return Order.findOneAndUpdate(
    filter,
    { $set: { status: 'canceled', 'cancelDetails.reason': reason || null, 'cancelDetails.canceledBy': role === 'admin' ? 'admin' : 'user', 'cancelDetails.date': Date.now() } },
    { new: true }
  );
};

module.exports = {
  createOrderFromCart,
  getOrdersByUser,
  getOrderById,
  cancelOrder,
};

