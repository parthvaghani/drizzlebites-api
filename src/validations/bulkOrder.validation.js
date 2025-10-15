const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBulkOrder = {
  body: Joi.object().keys({
    fullName: Joi.string().trim().required().messages({ 'any.required': 'Full Name is required' }),
    emailAddress: Joi.string().email().required().messages({
      'any.required': 'Email Address is required',
      'string.email': 'Please provide a valid email address'
    }),
    phoneNumber: Joi.string().trim().required().messages({ 'any.required': 'Phone Number is required' }),
    deliveryAddress: Joi.string().trim().required().messages({ 'any.required': 'Delivery Address is required' }),
    products: Joi.array().items(Joi.string().custom(objectId)).min(1).required().messages({
      'any.required': 'Products are required',
      'array.min': 'At least one product must be selected'
    }),
  }),
};

const getBulkOrders = {
  query: Joi.object().keys({
    search: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
  }),
};

const getBulkOrderById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateBulkOrder = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string().trim().optional(),
    emailAddress: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address'
    }),
    phoneNumber: Joi.string().trim().optional(),
    deliveryAddress: Joi.string().trim().optional(),
    products: Joi.array().items(Joi.string().custom(objectId)).min(1).optional(),
  }),
};

const deleteBulkOrder = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createBulkOrder,
  getBulkOrders,
  getBulkOrderById,
  updateBulkOrder,
  deleteBulkOrder
};
