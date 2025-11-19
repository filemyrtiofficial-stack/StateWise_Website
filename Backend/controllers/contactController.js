/**
 * Contact Controller
 * Handles contact form submissions from Contact Us page
 */

const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { sendFormSubmissionEmail } = require('../utils/email');
const { sendFormSubmissionNotification } = require('../utils/whatsapp/whatsapp');

/**
 * Create a new contact submission (Public - no auth required)
 */
const createContact = async (req, res, next) => {
  try {
    logger.info('Contact form submission received:', {
      body: req.body,
      ip: req.ip
    });

    const { firstName, lastName, email, mobile, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !mobile) {
      return sendError(res, 'First name, last name, email, and mobile number are required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    // Mobile validation (10-13 digits)
    const cleanMobile = mobile.replace(/\D/g, '');
    const length = cleanMobile.length;
    if (length < 10 || length > 13) {
      return sendError(res, 'Mobile number must be between 10 and 13 digits', 400);
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Prepare form data for notifications
    const formData = {
      'Full Name': fullName,
      'Email': email.trim().toLowerCase(),
      'Mobile': cleanMobile,
      'Message': message ? message.trim() : '(Not provided)',
      'Submission Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Send email notification (non-blocking)
    sendFormSubmissionEmail('Contact Us', formData).catch(err => {
      logger.error('Email notification error (non-critical):', err.message);
    });

    // Send WhatsApp notification (non-blocking)
    sendFormSubmissionNotification('Contact Us', formData).catch(err => {
      logger.error('WhatsApp notification error (non-critical):', err.message);
    });

    logger.info(`✅ Contact form submitted: ${fullName} - ${email}`);

    return sendSuccess(res, {
      message: 'Thank you for contacting us! We will get back to you soon.'
    }, 201);

  } catch (error) {
    logger.error('Error processing contact form:', error);
    return sendError(res, 'Failed to submit contact form. Please try again.', 500);
  }
};

module.exports = {
  createContact
};

