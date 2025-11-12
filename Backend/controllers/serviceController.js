/**
 * Service Controller
 * Handles RTI service operations
 */

const Service = require('../models/Service');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Get all services
 */
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    return sendSuccess(res, 'Services retrieved successfully', services);
  } catch (error) {
    next(error);
  }
};

/**
 * Get service by slug
 */
const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const service = await Service.findBySlug(slug);
    if (!service) {
      return sendError(res, 'Service not found', 404);
    }

    return sendSuccess(res, 'Service retrieved successfully', service);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new service (Admin only)
 */
const createService = async (req, res, next) => {
  try {
    const serviceData = req.body;

    // Check if service with same slug exists
    const existingService = await Service.findBySlug(serviceData.slug);
    if (existingService) {
      return sendError(res, 'Service with this slug already exists', 409);
    }

    const serviceId = await Service.create(serviceData);
    const service = await Service.findById(serviceId);

    logger.info(`Service created: ${serviceData.slug}`);

    return sendSuccess(res, 'Service created successfully', service, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update service (Admin only)
 */
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const serviceData = req.body;

    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return sendError(res, 'Service not found', 404);
    }

    const updatedService = await Service.update(id, serviceData);

    logger.info(`Service updated: ${id}`);

    return sendSuccess(res, 'Service updated successfully', updatedService);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete service (Admin only)
 */
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return sendError(res, 'Service not found', 404);
    }

    await Service.delete(id);

    logger.info(`Service deleted: ${id}`);

    return sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};

