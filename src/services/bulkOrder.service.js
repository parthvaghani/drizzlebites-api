const BulkOrder = require('../models/bulkOrder.model');
const Product = require('../models/product.model');

const createBulkOrder = async (data) => {
  try {
    // Validate that all products exist
    const products = await Product.find({ _id: { $in: data.products } });
    if (products.length !== data.products.length) {
      throw new Error('One or more products not found');
    }

    const doc = await BulkOrder.create(data);
    return await BulkOrder.findById(doc._id).populate('products', 'name description images variants');
  } catch (error) {
    throw error;
  }
};

const getBulkOrders = async (query = {}) => {
  try {
    const { page = 1, limit = 10, sortBy, search = '' } = query;

    const filter = {};

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    const sort = (() => {
      if (!sortBy) return { createdAt: -1 };
      const sortObj = {};
      const fields = String(sortBy).split(',');
      for (const f of fields) {
        const trimmed = f.trim();
        if (!trimmed) continue;
        if (trimmed.includes(':')) {
          const [key, order] = trimmed.split(':');
          sortObj[key] = order === 'asc' ? 1 : -1;
        } else if (trimmed.startsWith('-')) {
          sortObj[trimmed.substring(1)] = -1;
        } else {
          sortObj[trimmed] = 1;
        }
      }
      return Object.keys(sortObj).length ? sortObj : { createdAt: -1 };
    })();

    const skip = (options.page - 1) * options.limit;

    let searchFilter = {};
    if (search && String(search).trim() !== '') {
      const regex = { $regex: String(search), $options: 'i' };
      searchFilter = {
        $or: [
          { fullName: regex },
          { emailAddress: regex },
          { phoneNumber: regex },
          { deliveryAddress: regex },
        ],
      };
    }

    const combined = { ...filter, ...searchFilter };

    const [totalResults, results] = await Promise.all([
      BulkOrder.countDocuments(combined),
      BulkOrder.find(combined)
        .populate('products', 'name description images variants')
        .sort(sort)
        .skip(skip)
        .limit(options.limit),
    ]);

    const totalPages = Math.ceil(totalResults / options.limit);
    return {
      results,
      currentResults: results.length,
      page: options.page,
      limit: options.limit,
      totalPages,
      totalResults,
    };
  } catch (error) {
    throw error;
  }
};

const getBulkOrderById = async (id) => {
  try {
    if (!id) throw new Error('Bulk Order ID is required');
    const doc = await BulkOrder.findById(id).populate('products', 'name description images variants');
    if (!doc) return null;
    return doc;
  } catch (error) {
    throw error;
  }
};

const updateBulkOrder = async (id, updateData) => {
  try {
    if (!id) throw new Error('Bulk Order ID is required');

    // If products are being updated, validate they exist
    if (updateData.products) {
      const products = await Product.find({ _id: { $in: updateData.products } });
      if (products.length !== updateData.products.length) {
        throw new Error('One or more products not found');
      }
    }

    const doc = await BulkOrder.findByIdAndUpdate(id, updateData, { new: true })
      .populate('products', 'name description images variants');
    if (!doc) return null;
    return doc;
  } catch (error) {
    throw error;
  }
};

const deleteBulkOrder = async (id) => {
  try {
    if (!id) throw new Error('Bulk Order ID is required');
    const doc = await BulkOrder.findByIdAndDelete(id);
    if (!doc) return null;
    return doc;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBulkOrder,
  getBulkOrders,
  getBulkOrderById,
  updateBulkOrder,
  deleteBulkOrder
};
