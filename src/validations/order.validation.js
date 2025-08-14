const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const orderIdParam = Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
});

const getOrderById = { params: orderIdParam };

const cancelOrder = {
  params: orderIdParam,
  body: Joi.object().keys({
    reason: Joi.string().allow('').default(null),
  }),
};

module.exports = {
  createOrder,
  getOrderById,
  cancelOrder,
};

