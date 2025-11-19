/**
 * Career Controller
 * Handles job application submissions from Careers page
 */

const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { sendFormSubmissionEmail } = require('../utils/email');
const { sendFormSubmissionNotification } = require('../utils/whatsapp/whatsapp');

/**
 * Create a new career application (Public - no auth required)
 */
const createCareerApplication = async (req, res, next) => {
  try {
    // Handle multer errors (file upload errors)
    if (req.fileValidationError) {
      return sendError(res, req.fileValidationError, 400);
    }

    logger.info('Career application submission received:', {
      body: { ...req.body, resume: req.file ? `File: ${req.file.originalname}` : 'No file' },
      ip: req.ip
    });

    const { name, email, phone, position, coverLetter } = req.body;

    // Validation
    if (!name || !email || !phone || !position) {
      return sendError(res, 'Name, email, phone, and position are required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    // Mobile validation (10-13 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    const length = cleanPhone.length;
    if (length < 10 || length > 13) {
      return sendError(res, 'Phone number must be between 10 and 13 digits', 400);
    }

    // Prepare form data for notifications
    const formData = {
      'Name': name.trim(),
      'Email': email.trim().toLowerCase(),
      'Phone': cleanPhone,
      'Position Applied For': position.trim(),
      'Cover Letter': coverLetter ? coverLetter.trim() : '(Not provided)',
      'Resume': req.file ? `Attached: ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)} KB)` : '(Not provided)',
      'Resume File': req.file ? req.file.filename : 'No file uploaded',
      'Submission Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Log file upload info
    if (req.file) {
      logger.info(`📎 Resume uploaded: ${req.file.originalname} -> ${req.file.filename} (${(req.file.size / 1024).toFixed(2)} KB)`);
    } else {
      logger.info('📎 No resume file uploaded');
    }

    // Send email notification (non-blocking)
    sendFormSubmissionEmail('Career Application', formData).catch(err => {
      logger.error('Email notification error (non-critical):', err.message);
    });

    // Send WhatsApp notification (non-blocking)
    sendFormSubmissionNotification('Career Application', formData).catch(err => {
      logger.error('WhatsApp notification error (non-critical):', err.message);
    });

    logger.info(`✅ Career application submitted: ${name} - ${position} - ${email}`);

    return sendSuccess(res, {
      message: 'Thank you for your application! We have received your information and will get back to you soon.'
    }, 201);

  } catch (error) {
    logger.error('Error processing career application:', error);
    return sendError(res, 'Failed to submit application. Please try again.', 500);
  }
};

module.exports = {
  createCareerApplication
};

