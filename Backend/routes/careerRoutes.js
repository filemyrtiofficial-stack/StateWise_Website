/**
 * Career Routes
 * Handles job application submissions
 */

const express = require('express');
const router = express.Router();
const { createCareerApplication } = require('../controllers/careerController');
const { uploadResume } = require('../middlewares/upload');

/**
 * POST /api/v1/careers/public
 * Public endpoint to submit job application
 * Accepts multipart/form-data with optional resume file
 */
router.post('/public', uploadResume, createCareerApplication);

module.exports = router;

