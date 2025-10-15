const PartnershipRequest = require('../models/partnershipRequest.model');

const createPartnershipRequest = async (data) => {
  try {
    const doc = await PartnershipRequest.create(data);
    return doc;
  } catch (error) {
    throw error;
  }
};

const getPartnershipRequests = async (query = {}) => {
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
          { additionalInformation: regex },
        ],
      };
    }

    const combined = { ...filter, ...searchFilter };

    const [totalResults, results] = await Promise.all([
      PartnershipRequest.countDocuments(combined),
      PartnershipRequest.find(combined).sort(sort).skip(skip).limit(options.limit),
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

const getPartnershipRequestById = async (id) => {
  try {
    if (!id) throw new Error('Partnership Request ID is required');
    const doc = await PartnershipRequest.findById(id);
    if (!doc) return null;
    return doc;
  } catch (error) {
    throw error;
  }
};

const deletePartnershipRequest = async (id) => {
  try {
    if (!id) throw new Error('Partnership Request ID is required');
    const doc = await PartnershipRequest.findByIdAndDelete(id);
    if (!doc) return null;
    return doc;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPartnershipRequest,
  getPartnershipRequests,
  getPartnershipRequestById,
  deletePartnershipRequest
};
