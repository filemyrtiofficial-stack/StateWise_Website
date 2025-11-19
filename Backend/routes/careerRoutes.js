/**
 * Career Routes
 * Handles job application submissions
 */

const express = require('express');
const router = express.Router();
const { createCareerApplication } = require('../controllers/careerController');

/**
 * POST /api/v1/careers/public
 * Public endpoint to submit job application
 */
router.post('/public', createCareerApplication);

module.exports = router;

