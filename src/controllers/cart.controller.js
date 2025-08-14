const catchAsync = require('../utils/catchAsync');
const service = require('../services/cart.service');
const { getProductById } = require('../services/product.service');

const getUserCartItems = catchAsync(async (req, res) => {
  const user = req.user;
  const data = await service.getUserCart(user?._id);
  if (!data) {
    return res.status(400).json({
      success: false,
      message: 'Something Went Wrong In Get User Cart'
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Get Cart Data successfully',
    data: data
  });
});

const addToCart = catchAsync(async (req, res) => {
  const user = req.user;
  const getProduct = await getProductById(req.body.productId);

  // Find the variant type (gm or kg) that contains the given weight
  let variantLabel = '';
  const weightInput = req.body.weight;
  if (getProduct && getProduct.variants) {
    for (const variantType of ['gm', 'kg']) {
      const variantsArr = getProduct.variants[variantType];
      if (Array.isArray(variantsArr)) {
        const found = variantsArr.find(v => v.weight === weightInput);
        if (found) {
          variantLabel = `${variantType}`;
          break;
        }
      }
    }
  }

  const dataPayload = {
    userId: user?._id,
    productId: req.body.productId,
    weight: req.body.weight,
    totalProduct: req.body.totalProduct,
    weightVariant: variantLabel,
    weight: req.body.weight,
  };
  const existingCart = await service.getCartByDetails(dataPayload);
  if (existingCart) {
    const updatedProduct = existingCart?.totalProduct + 1;
    const updatedData = await service.updateCart(existingCart?._id, updatedProduct);
    if (updatedData.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Something Went Wrong In Add Product To Cart'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product has been added to your cart',
    });
  }
  else {
    const data = await service.addToCart(dataPayload);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Something Went Wrong In Add Product To Cart'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product has been added to your cart'
    });
  }
});

const updateCart = catchAsync(async (req, res) => {
  const user = req.user;
  const getCartItem = await service.getCartById(req.body.cartId, user?._id);
  if (!getCartItem) {
    return res.status(400).json({
      message: 'Something Went Wrong In Update Product To Cart'
    });
  }
  let updatedProduct;
  if (req.body.action === 'weight') {
    const getProduct = await getProductById(getCartItem?.productId);

    // Merge gm and kg into one array
    const allVariants = [
      ...(getProduct?.variants?.gm || []),
      ...(getProduct?.variants?.kg || [])
    ];

    // Find matching variant by weight
    const selectedVariant = allVariants.find(v => v.weight === req.body.weight);

    if (!selectedVariant) {
      return res.status(400).json({
        success: false,
        message: 'Variant not found for the given weight'
      });
    }

    // Update the cart item with weight + variant id
    const updatedData = await service.updateCart(
      getCartItem?._id,
      selectedVariant.weight,
      req.body.weight
    );
    if (updatedData.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Something Went Wrong Update Product To Cart'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product weight updated in cart successfully',
    });
  }
  else if (req.body.action === 'increment') {
    updatedProduct = getCartItem?.totalProduct + 1;
  } else if (req.body.action === 'decrement') {
    updatedProduct = getCartItem?.totalProduct - 1;
    if (updatedProduct < 1) {
      const deleteProductCart = await service.deleteCartById(getCartItem?._id);
      if (deleteProductCart.modifiedCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Something Went Wrong In Add Product To Cart'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Product remove Successfully',
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid action for updating cart'
    });
  }
  const updatedData = await service.updateCart(getCartItem?._id, updatedProduct);
  if (updatedData.modifiedCount === 0) {
    return res.status(400).json({
      success: false,
      message: 'Something Went Wrong In Add Product To Cart'
    });
  }
  const message = `Product quantity ${req.body.action === 'increment' ? 'increased' : 'decreased'} successfully.`;
  return res.status(200).json({
    success: true,
    message: message,
  });
});

module.exports = {
  getUserCartItems,
  addToCart,
  updateCart
};