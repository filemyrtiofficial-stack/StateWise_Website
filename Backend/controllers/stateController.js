/**
 * State Controller
 * Handles state operations
 */

const State = require('../models/State');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Get all states
 */
const getAllStates = async (req, res, next) => {
  try {
    const states = await State.findAll();
    return sendSuccess(res, 'States retrieved successfully', states);
  } catch (error) {
    next(error);
  }
};

/**
 * Get state by slug
 */
const getStateBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Normalize slug (trim and lowercase for consistency)
    const normalizedSlug = slug ? slug.trim().toLowerCase() : '';

    if (!normalizedSlug) {
      return sendError(res, 'State slug is required', 400);
    }

    logger.debug(`Looking up state with slug: ${normalizedSlug}`);

    const state = await State.findBySlug(normalizedSlug);
    if (!state) {
      logger.warn(`State not found with slug: ${normalizedSlug}`);
      return sendError(res, 'State not found', 404);
    }

    logger.debug(`State found: ${state.name} (${state.slug})`);
    return sendSuccess(res, 'State retrieved successfully', state);
  } catch (error) {
    logger.error(`Error fetching state by slug: ${error.message}`, { error, slug: req.params.slug });
    next(error);
  }
};

/**
 * Create new state (Admin only)
 */
const createState = async (req, res, next) => {
  try {
    const stateData = req.body;

    // Check if state with same slug exists
    const existingState = await State.findBySlug(stateData.slug);
    if (existingState) {
      return sendError(res, 'State with this slug already exists', 409);
    }

    const stateId = await State.create(stateData);
    const state = await State.findById(stateId);

    logger.info(`State created: ${stateData.slug}`);

    return sendSuccess(res, 'State created successfully', state, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update state (Admin only)
 */
const updateState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stateData = req.body;

    // Check if state exists
    const existingState = await State.findById(id);
    if (!existingState) {
      return sendError(res, 'State not found', 404);
    }

    const updatedState = await State.update(id, stateData);

    logger.info(`State updated: ${id}`);

    return sendSuccess(res, 'State updated successfully', updatedState);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete state (Admin only)
 */
const deleteState = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if state exists
    const existingState = await State.findById(id);
    if (!existingState) {
      return sendError(res, 'State not found', 404);
    }

    await State.delete(id);

    logger.info(`State deleted: ${id}`);

    return sendSuccess(res, 'State deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStates,
  getStateBySlug,
  createState,
  updateState,
  deleteState
};

