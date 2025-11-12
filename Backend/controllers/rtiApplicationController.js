/**
 * RTI Application Controller
 * Handles RTI application operations
 */

const RTIApplication = require('../models/RTIApplication');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

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

    // For public submissions, user_id can be null or we create a guest user
    const applicationData = {
      ...req.body,
      user_id: null // Public submission, no user account required
    };

    // Validate required fields
    if (!applicationData.full_name || !applicationData.email || !applicationData.mobile) {
      return sendError(res, 'Missing required fields: full_name, email, and mobile are required', 400);
    }

    if (!applicationData.rti_query || applicationData.rti_query.trim() === '') {
      return sendError(res, 'RTI query is required', 400);
    }

    logger.info('Creating RTI application with data:', applicationData);

    const applicationId = await RTIApplication.create(applicationData);
    const application = await RTIApplication.findById(applicationId);

    logger.info(`✅ RTI application created (public): ID ${applicationId}, Email: ${applicationData.email}`);

    return sendSuccess(res, 'RTI application created successfully', application, 201);
  } catch (error) {
    logger.error('❌ Error creating public RTI application:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
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

    const applicationId = await RTIApplication.create(applicationData);
    const application = await RTIApplication.findById(applicationId);

    logger.info(`RTI application created: ${applicationId} by user: ${req.user.id}`);

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
