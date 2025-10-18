const service = require('../services/bulkOrder.service');
const emailService = require('../services/email.service');
const logger = require('../config/logger');
const bulkOrderInvoiceService = require('../services/bulkOrderInvoice.service');

const create = async (req, res) => {
  try {
    const { fullName, emailAddress, phoneNumber, deliveryAddress, products } = req.body || {};

    if (!fullName) return res.status(400).json({ message: 'Full Name is required' });
    if (!emailAddress) return res.status(400).json({ message: 'Email Address is required' });
    if (!phoneNumber) return res.status(400).json({ message: 'Phone Number is required' });
    if (!deliveryAddress) return res.status(400).json({ message: 'Delivery Address is required' });
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'At least one product is required' });
    }

    const doc = await service.createBulkOrder({
      fullName,
      emailAddress,
      phoneNumber,
      deliveryAddress,
      products
    });

    // Send email notification to seller
    try {
      await emailService.sendBulkOrderEmailForSeller(doc);
    } catch (emailError) {
      // Log email error but don't fail the request
      logger.error('Email sending failed:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Bulk order submitted successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const docs = await service.getBulkOrders(req.query);
    return res.status(200).json({
      message: 'Bulk orders fetched successfully',
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
    const doc = await service.getBulkOrderById(id);
    if (!doc) return res.status(404).json({ message: 'Bulk order not found' });
    return res.status(200).json({
      message: 'Bulk order fetched successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const updateById = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) return res.status(400).json({ message: 'id is required' });

    const updateData = { ...req.body };

    const doc = await service.updateBulkOrder(id, updateData);
    if (!doc) return res.status(404).json({ message: 'Bulk order not found' });

    return res.status(200).json({
      message: 'Bulk order updated successfully',
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
    const doc = await service.deleteBulkOrder(id);
    if (!doc) return res.status(404).json({ message: 'Bulk order not found' });
    return res.status(200).json({
      message: 'Bulk order deleted successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const downloadSummary = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) return res.status(400).json({ message: 'id is required' });

    const bulkOrder = await service.getBulkOrderById(id);
    if (!bulkOrder) return res.status(404).json({ message: 'Bulk order not found' });

    const pdfBuffer = await bulkOrderInvoiceService.generateBulkOrderSummaryPDF(bulkOrder);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bulk-order-${id}.pdf`);
    return res.send(pdfBuffer);
  } catch (error) {
    logger.error('Download summary error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

module.exports = { create, getAll, getById, updateById, deleteById, downloadSummary };
