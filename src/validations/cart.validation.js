const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addToCart = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    totalProduct: Joi.number().required(),
    weight: Joi.string().trim().required()
  }),
};

const updateCart = {
  body: Joi.object().keys({
    action: Joi.string().valid('increment', 'decrement', 'weight').required(),
    cartId: Joi.string().custom(objectId).required(),
    weight: Joi.string().optional().allow(''), // allows empty string
  }),
};

module.exports = {
  addToCart,
  updateCart
};