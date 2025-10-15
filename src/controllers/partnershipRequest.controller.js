const service = require('../services/partnershipRequest.service');
const emailService = require('../services/email.service');

const create = async (req, res) => {
  try {
    const { fullName, emailAddress, phoneNumber, additionalInformation } = req.body || {};

    if (!fullName) return res.status(400).json({ message: 'Full Name is required' });
    if (!emailAddress) return res.status(400).json({ message: 'Email Address is required' });
    if (!phoneNumber) return res.status(400).json({ message: 'Phone Number is required' });

    const doc = await service.createPartnershipRequest({
      fullName,
      emailAddress,
      phoneNumber,
      additionalInformation
    });

    // Send email notification to seller
    try {
      await emailService.sendPartnershipRequestEmailForSeller(doc);
    } catch (emailError) {
      // Log email error but don't fail the request
      return res.status(500).json(emailError || 'Failed to send partnership request email');
    }

    return res.status(201).json({
      message: 'Partnership request submitted successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const docs = await service.getPartnershipRequests(req.query);
    return res.status(200).json({
      message: 'Partnership requests fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) return res.status(400).json({ message: 'id is required' });
    const doc = await service.getPartnershipRequestById(id);
    if (!doc) return res.status(404).json({ message: 'Partnership request not found' });
    return res.status(200).json({
      message: 'Partnership request fetched successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) return res.status(400).json({ message: 'id is required' });
    const doc = await service.deletePartnershipRequest(id);
    if (!doc) return res.status(404).json({ message: 'Partnership request not found' });
    return res.status(200).json({
      message: 'Partnership request deleted successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

module.exports = { create, getAll, getById, deleteById };
