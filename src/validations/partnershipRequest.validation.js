const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPartnershipRequest = {
  body: Joi.object().keys({
    fullName: Joi.string().trim().required().messages({ 'any.required': 'Full Name is required' }),
    emailAddress: Joi.string().email().required().messages({
      'any.required': 'Email Address is required',
      'string.email': 'Please provide a valid email address'
    }),
    phoneNumber: Joi.string().trim().required().messages({ 'any.required': 'Phone Number is required' }),
    additionalInformation: Joi.string().trim().allow('').optional(),
  }),
};

const getPartnershipRequests = {
  query: Joi.object().keys({
    search: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
  }),
};

const getPartnershipRequestById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const deletePartnershipRequest = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createPartnershipRequest,
  getPartnershipRequests,
  getPartnershipRequestById,
  deletePartnershipRequest
};
