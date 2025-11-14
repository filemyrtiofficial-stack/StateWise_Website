/**
 * Consultation Controller
 * Handles consultation form submissions from hero section
 */

const Consultation = require('../models/Consultation');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Create a new consultation (Public - no auth required)
 */
const createConsultation = async (req, res, next) => {
  try {
    // Log incoming request for debugging
    logger.info('Consultation submission received:', {
      body: req.body,
      ip: req.ip
    });

    const { full_name, email, mobile, address, pincode, state_slug, source } = req.body;

    // Log received fields for debugging
    console.log('📥 Received consultation data:', {
      full_name: full_name ? `${full_name.substring(0, 20)}...` : 'MISSING',
      email: email || 'MISSING',
      mobile: mobile || 'MISSING',
      address: address ? `${address.substring(0, 30)}...` : 'NULL/EMPTY',
      pincode: pincode || 'NULL/EMPTY',
      state_slug: state_slug || 'NULL',
      source: source || 'NULL'
    });

    // Validation - only full_name, email, and mobile are required
    if (!full_name || !email || !mobile) {
      console.log('❌ Validation failed - missing required fields:', {
        has_full_name: !!full_name,
        has_email: !!email,
        has_mobile: !!mobile
      });
      return sendError(res, 'Name, email, and mobile number are required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    // Mobile validation (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!mobileRegex.test(cleanMobile)) {
      return sendError(res, 'Invalid mobile number format', 400);
    }

    // Address and pincode are optional - use empty string if not provided
    const addressValue = address ? address.trim() : '';
    const pincodeValue = pincode ? pincode.trim() : '';

    // Create consultation
    const consultationId = await Consultation.create({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      mobile: cleanMobile,
      address: addressValue,
      pincode: pincodeValue,
      state_slug: state_slug || null,
      source: source || 'hero_section'
    });

    logger.info(`✅ Consultation created: ID ${consultationId}, Email: ${email}`);

    const consultation = await Consultation.findById(consultationId);

    return sendSuccess(res, 'Consultation submitted successfully', consultation, 201);
  } catch (error) {
    logger.error('Error creating consultation:', error);
    next(error);
  }
};

/**
 * Get all consultations (Admin only)
 */
const getAllConsultations = async (req, res, next) => {
  try {
    const { status, state_slug, limit } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (state_slug) filters.state_slug = state_slug;
    if (limit) filters.limit = parseInt(limit);

    const consultations = await Consultation.findAll(filters);

    return sendSuccess(res, 'Consultations retrieved successfully', consultations);
  } catch (error) {
    logger.error('Error fetching consultations:', error);
    next(error);
  }
};

/**
 * Get consultation by ID (Admin only)
 */
const getConsultationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return sendError(res, 'Consultation not found', 404);
    }

    return sendSuccess(res, 'Consultation retrieved successfully', consultation);
  } catch (error) {
    logger.error('Error fetching consultation:', error);
    next(error);
  }
};

/**
 * Update consultation status (Admin only)
 */
const updateConsultationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return sendError(res, 'Consultation not found', 404);
    }

    const updated = await Consultation.updateStatus(id, status, notes);

    return sendSuccess(res, 'Consultation status updated successfully', updated);
  } catch (error) {
    logger.error('Error updating consultation:', error);
    next(error);
  }
};

module.exports = {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus
};

