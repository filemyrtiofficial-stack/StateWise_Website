/**
 * Callback Request Controller
 * Handles callback form submissions from hero section
 */

const CallbackRequest = require('../models/CallbackRequest');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { sendFormSubmissionEmail } = require('../utils/email');
const { sendFormSubmissionNotification } = require('../utils/whatsapp/whatsapp');

/**
 * Create a new callback request (Public - no auth required)
 */
const createCallbackRequest = async (req, res, next) => {
  try {
    const { phone, state_slug } = req.body;

    // Validation
    if (!phone) {
      return sendError(res, 'Phone number is required', 400);
    }

    // Mobile validation (10-13 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    const length = cleanPhone.length;
    if (length < 10 || length > 13) {
      return sendError(res, 'Phone number must be between 10 and 13 digits', 400);
    }

    // Create callback request
    const callbackId = await CallbackRequest.create({
      phone: cleanPhone,
      state_slug: state_slug || null
    });

    logger.info(`✅ Callback request created: ID ${callbackId}, Phone: ${cleanPhone}`);

    const callbackRequest = await CallbackRequest.findById(callbackId);

    // Send email notification (non-blocking)
    sendFormSubmissionEmail('Callback Request', {
      'Phone': cleanPhone,
      'State Slug': state_slug || '(Not provided)',
      'Submission ID': callbackId
    }).catch(err => {
      // Already logged in email service, just ensure it doesn't break anything
      logger.error('Email notification error (non-critical):', err.message);
    });

    // Send WhatsApp notification (non-blocking)
    sendFormSubmissionNotification('Callback Request', {
      'Phone': cleanPhone,
      'State Slug': state_slug || '(Not provided)',
      'Submission ID': callbackId
    }).catch(err => {
      // Already logged in WhatsApp service, just ensure it doesn't break anything
      logger.error('WhatsApp notification error (non-critical):', err.message);
    });

    return sendSuccess(res, 'Callback request submitted successfully', callbackRequest, 201);
  } catch (error) {
    logger.error('Error creating callback request:', error);
    next(error);
  }
};

/**
 * Get all callback requests (Admin only)
 */
const getAllCallbackRequests = async (req, res, next) => {
  try {
    const { status, state_slug, limit } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (state_slug) filters.state_slug = state_slug;
    if (limit) filters.limit = parseInt(limit);

    const callbackRequests = await CallbackRequest.findAll(filters);

    return sendSuccess(res, 'Callback requests retrieved successfully', callbackRequests);
  } catch (error) {
    logger.error('Error fetching callback requests:', error);
    next(error);
  }
};

/**
 * Get callback request by ID (Admin only)
 */
const getCallbackRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const callbackRequest = await CallbackRequest.findById(id);
    if (!callbackRequest) {
      return sendError(res, 'Callback request not found', 404);
    }

    return sendSuccess(res, 'Callback request retrieved successfully', callbackRequest);
  } catch (error) {
    logger.error('Error fetching callback request:', error);
    next(error);
  }
};

/**
 * Update callback request status (Admin only)
 */
const updateCallbackRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const callbackRequest = await CallbackRequest.findById(id);
    if (!callbackRequest) {
      return sendError(res, 'Callback request not found', 404);
    }

    const updated = await CallbackRequest.updateStatus(id, status, notes);

    return sendSuccess(res, 'Callback request status updated successfully', updated);
  } catch (error) {
    logger.error('Error updating callback request:', error);
    next(error);
  }
};

module.exports = {
  createCallbackRequest,
  getAllCallbackRequests,
  getCallbackRequestById,
  updateCallbackRequestStatus
};

