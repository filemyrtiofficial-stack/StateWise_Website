/**
 * Contact Routes
 * Handles contact form submissions
 */

const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contactController');

/**
 * POST /api/v1/contact/public
 * Public endpoint to submit contact form
 */
router.post('/public', createContact);

module.exports = router;

