/**
 * RTI Application Controller
 * Handles RTI application operations
 */

const RTIApplication = require('../models/RTIApplication');
const PaymentRecovery = require('../models/PaymentRecovery');
const Service = require('../models/Service');
const State = require('../models/State');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { sendFormSubmissionEmail } = require('../utils/email');
const { sendFormSubmissionNotification } = require('../utils/whatsapp/whatsapp');

/**
 * Create new RTI application (Public - no auth required)
 */
const createApplicationPublic = async (req, res, next) => {
  try {
    // Log incoming request for debugging
    logger.info('Public RTI application submission received:', {
      body: req.body,
      ip: req.ip
    });

    // Log validation details for debugging
    logger.info('Request body details:', {
      service_id: req.body.service_id,
      state_id: req.body.state_id,
      service_id_type: typeof req.body.service_id,
      state_id_type: typeof req.body.state_id,
      has_payment_id: !!req.body.payment_id,
      has_order_id: !!req.body.order_id,
      payment_id: req.body.payment_id,
      order_id: req.body.order_id,
      full_name: req.body.full_name ? `${req.body.full_name.substring(0, 20)}...` : 'MISSING',
      email: req.body.email || 'MISSING',
      mobile: req.body.mobile || 'MISSING',
      rti_query_length: req.body.rti_query ? req.body.rti_query.length : 0,
      address_length: req.body.address ? req.body.address.length : 0,
      pincode: req.body.pincode || 'MISSING'
    });

    // For public submissions, user_id can be null or we create a guest user
    const applicationData = {
      ...req.body,
      user_id: null // Public submission, no user account required
    };

    // Validate required fields
    if (!applicationData.full_name || !applicationData.email || !applicationData.mobile) {
      return sendError(res, 'Missing required fields: full_name, email, and mobile are required', 400);
    }

    // Validate all required fields are present and valid
    const missingFields = [];
    if (!applicationData.service_id) missingFields.push('service_id');
    if (!applicationData.state_id) missingFields.push('state_id');
    if (!applicationData.full_name || applicationData.full_name.trim() === '') missingFields.push('full_name');
    if (!applicationData.email || applicationData.email.trim() === '') missingFields.push('email');
    if (!applicationData.mobile || applicationData.mobile.trim() === '') missingFields.push('mobile');
    // RTI query is optional - removed from required fields
    if (!applicationData.address || applicationData.address.trim() === '') missingFields.push('address');
    if (!applicationData.pincode || applicationData.pincode.trim() === '') missingFields.push('pincode');

    if (missingFields.length > 0) {
      logger.error('❌ Missing required fields:', { missingFields, body: req.body });
      return sendError(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Validate field lengths
    if (applicationData.full_name.length < 2 || applicationData.full_name.length > 100) {
      return sendError(res, 'Full name must be between 2 and 100 characters', 400);
    }

    // RTI query is optional - normalize and validate only maximum length
    // Allow any length including 0, 1, or more characters (no minimum required)
    if (!applicationData.rti_query || applicationData.rti_query === null || applicationData.rti_query === undefined) {
      applicationData.rti_query = '';
    } else {
      const trimmedQuery = applicationData.rti_query.trim();
      // Only validate maximum length (5000 characters) - no minimum required
      if (trimmedQuery.length > 5000) {
        return sendError(res, 'RTI query must not exceed 5000 characters', 400);
      }
      // Accept any length including 0 or 1 character
      applicationData.rti_query = trimmedQuery;
    }

    if (applicationData.address.length < 10 || applicationData.address.length > 500) {
      return sendError(res, 'Address must be between 10 and 500 characters', 400);
    }

    // Validate that service_id exists in the database
    const service = await Service.findById(applicationData.service_id);
    if (!service) {
      logger.error('❌ Service not found:', { service_id: applicationData.service_id });
      return sendError(res, `Service with ID ${applicationData.service_id} does not exist. Please ensure the service exists in the database.`, 400);
    }

    // Validate that state_id exists in the database
    const state = await State.findById(applicationData.state_id);
    if (!state) {
      logger.error('❌ State not found:', { state_id: applicationData.state_id });
      return sendError(res, `State with ID ${applicationData.state_id} does not exist. Please ensure the state exists in the database.`, 400);
    }

    logger.info('Creating RTI application with data:', {
      service_id: applicationData.service_id,
      service_name: service.name,
      state_id: applicationData.state_id,
      state_name: state.name,
      payment_id: applicationData.payment_id || 'none',
      order_id: applicationData.order_id || 'none',
      email: applicationData.email,
      full_name_length: applicationData.full_name.length,
      rti_query_length: applicationData.rti_query ? applicationData.rti_query.length : 0,
      address_length: applicationData.address.length
    });

    const applicationId = await RTIApplication.create(applicationData);
    const application = await RTIApplication.findById(applicationId);

    logger.info(`✅ RTI application created (public): ID ${applicationId}, Email: ${applicationData.email}, Payment ID: ${applicationData.payment_id || 'none'}`);

    // Send email notification (non-blocking)
    sendFormSubmissionEmail('RTI Application', {
      'Application ID': applicationId,
      'Full Name': applicationData.full_name.trim(),
      'Email': applicationData.email.trim(),
      'Mobile': applicationData.mobile.trim(),
      'Service': service.name || `Service ID: ${applicationData.service_id}`,
      'State': state.name || `State ID: ${applicationData.state_id}`,
      'RTI Query': applicationData.rti_query && applicationData.rti_query.length > 0
        ? (applicationData.rti_query.substring(0, 500) + (applicationData.rti_query.length > 500 ? '...' : ''))
        : '(Not provided)',
      'Address': applicationData.address.trim(),
      'Pincode': applicationData.pincode.trim(),
      'Payment ID': applicationData.payment_id || '(Not provided)',
      'Order ID': applicationData.order_id || '(Not provided)'
    }).catch(err => {
      // Already logged in email service, just ensure it doesn't break anything
      logger.error('Email notification error (non-critical):', err.message);
    });

    // Send WhatsApp notification (non-blocking)
    sendFormSubmissionNotification('RTI Application', {
      'Application ID': applicationId,
      'Full Name': applicationData.full_name.trim(),
      'Email': applicationData.email.trim(),
      'Mobile': applicationData.mobile.trim(),
      'Service': service.name || `Service ID: ${applicationData.service_id}`,
      'State': state.name || `State ID: ${applicationData.state_id}`,
      'RTI Query': applicationData.rti_query && applicationData.rti_query.length > 0
        ? (applicationData.rti_query.substring(0, 500) + (applicationData.rti_query.length > 500 ? '...' : ''))
        : '(Not provided)',
      'Address': applicationData.address.trim(),
      'Pincode': applicationData.pincode.trim(),
      'Payment ID': applicationData.payment_id || '(Not provided)',
      'Order ID': applicationData.order_id || '(Not provided)'
    }).catch(err => {
      // Already logged in WhatsApp service, just ensure it doesn't break anything
      logger.error('WhatsApp notification error (non-critical):', err.message);
    });

    return sendSuccess(res, 'RTI application created successfully', application, 201);
  } catch (error) {
    logger.error('❌ Error creating public RTI application:', {
      error: error.message,
      code: error.code,
      stack: error.stack,
      body: req.body,
      payment_id: req.body.payment_id,
      order_id: req.body.order_id
    });

    // If payment was made but application creation failed, store for recovery
    if (req.body.payment_id && req.body.order_id) {
      try {
        await PaymentRecovery.create({
          payment_id: req.body.payment_id,
          order_id: req.body.order_id,
          service_id: req.body.service_id || 1,
          state_id: req.body.state_id || 1,
          full_name: req.body.full_name || '',
          mobile: req.body.mobile || '',
          email: req.body.email || '',
          rti_query: req.body.rti_query || '',
          address: req.body.address || '',
          pincode: req.body.pincode || '',
          error_message: error.message,
          request_body: req.body
        });
        logger.warn('💾 Payment recovery record created:', {
          payment_id: req.body.payment_id,
          order_id: req.body.order_id
        });
      } catch (recoveryError) {
        logger.error('❌ Failed to create payment recovery record:', recoveryError);
        // Continue with original error even if recovery record creation fails
      }
    }

    next(error);
  }
};

/**
 * Create new RTI application (Authenticated)
 */
const createApplication = async (req, res, next) => {
  try {
    const applicationData = {
      ...req.body,
      user_id: req.user.id // Get from authenticated user
    };

    // Get service and state names for email
    let serviceName = `Service ID: ${applicationData.service_id}`;
    let stateName = `State ID: ${applicationData.state_id}`;
    try {
      const service = await Service.findById(applicationData.service_id);
      if (service) serviceName = service.name;
      const state = await State.findById(applicationData.state_id);
      if (state) stateName = state.name;
    } catch (err) {
      // Non-critical, continue
    }

    const applicationId = await RTIApplication.create(applicationData);
    const application = await RTIApplication.findById(applicationId);

    logger.info(`RTI application created: ${applicationId} by user: ${req.user.id}`);

    // Send email notification (non-blocking)
    sendFormSubmissionEmail('RTI Application (Authenticated)', {
      'Application ID': applicationId,
      'User ID': req.user.id,
      'Full Name': applicationData.full_name?.trim() || '(Not provided)',
      'Email': applicationData.email?.trim() || '(Not provided)',
      'Mobile': applicationData.mobile?.trim() || '(Not provided)',
      'Service': serviceName,
      'State': stateName,
      'RTI Query': applicationData.rti_query ? (applicationData.rti_query.substring(0, 500) + (applicationData.rti_query.length > 500 ? '...' : '')) : '(Not provided)',
      'Address': applicationData.address?.trim() || '(Not provided)',
      'Pincode': applicationData.pincode?.trim() || '(Not provided)'
    }).catch(err => {
      // Already logged in email service, just ensure it doesn't break anything
      logger.error('Email notification error (non-critical):', err.message);
    });

    // Send WhatsApp notification (non-blocking)
    sendFormSubmissionNotification('RTI Application (Authenticated)', {
      'Application ID': applicationId,
      'User ID': req.user.id,
      'Full Name': applicationData.full_name?.trim() || '(Not provided)',
      'Email': applicationData.email?.trim() || '(Not provided)',
      'Mobile': applicationData.mobile?.trim() || '(Not provided)',
      'Service': serviceName,
      'State': stateName,
      'RTI Query': applicationData.rti_query ? (applicationData.rti_query.substring(0, 500) + (applicationData.rti_query.length > 500 ? '...' : '')) : '(Not provided)',
      'Address': applicationData.address?.trim() || '(Not provided)',
      'Pincode': applicationData.pincode?.trim() || '(Not provided)'
    }).catch(err => {
      // Already logged in WhatsApp service, just ensure it doesn't break anything
      logger.error('WhatsApp notification error (non-critical):', err.message);
    });

    return sendSuccess(res, 'RTI application created successfully', application, 201);
  } catch (error) {
    logger.error('Error creating RTI application:', error);
    next(error);
  }
};

/**
 * Get all applications (with filters)
 */
const getAllApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};

    // Apply filters based on query params
    if (req.query.status) filters.status = req.query.status;
    if (req.query.service_id) filters.service_id = req.query.service_id;
    if (req.query.state_id) filters.state_id = req.query.state_id;

    // If not admin, only show user's own applications
    if (req.user.role !== 'admin') {
      filters.user_id = req.user.id;
    } else if (req.query.user_id) {
      filters.user_id = req.query.user_id;
    }

    const result = await RTIApplication.findAll(filters, page, limit);

    return sendSuccess(res, 'Applications retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get application by ID
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await RTIApplication.findById(id);
    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    // Check if user has access (own application or admin)
    if (req.user.role !== 'admin' && application.user_id !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    return sendSuccess(res, 'Application retrieved successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's applications
 */
const getMyApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await RTIApplication.findByUserId(req.user.id, page, limit);

    return sendSuccess(res, 'Applications retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status (Admin only)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'submitted', 'in_progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const application = await RTIApplication.updateStatus(id, status);

    logger.info(`Application status updated: ${id} to ${status}`);

    return sendSuccess(res, 'Application status updated successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * Update application
 */
const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if application exists
    const existingApplication = await RTIApplication.findById(id);
    if (!existingApplication) {
      return sendError(res, 'Application not found', 404);
    }

    // Check if user has access
    if (req.user.role !== 'admin' && existingApplication.user_id !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    const updatedApplication = await RTIApplication.update(id, req.body);

    logger.info(`Application updated: ${id}`);

    return sendSuccess(res, 'Application updated successfully', updatedApplication);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete application
 */
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if application exists
    const existingApplication = await RTIApplication.findById(id);
    if (!existingApplication) {
      return sendError(res, 'Application not found', 404);
    }

    // Check if user has access
    if (req.user.role !== 'admin' && existingApplication.user_id !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    await RTIApplication.delete(id);

    logger.info(`Application deleted: ${id}`);

    return sendSuccess(res, 'Application deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplicationPublic,
  createApplication,
  getAllApplications,
  getApplicationById,
  getMyApplications,
  updateApplicationStatus,
  updateApplication,
  deleteApplication
};
