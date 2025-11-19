/**
 * Newsletter Subscription Controller
 * Handles newsletter email subscriptions
 */

const NewsletterSubscription = require('../models/NewsletterSubscription');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { sendFormSubmissionEmail } = require('../utils/email');
const { sendFormSubmissionNotification } = require('../utils/whatsapp/whatsapp');

/**
 * Subscribe to newsletter (Public - no auth required)
 */
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return sendError(res, 'Email address is required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      return sendError(res, 'Invalid email format', 400);
    }

    // Check if already subscribed
    const existingSubscription = await NewsletterSubscription.findByEmail(cleanEmail);

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return sendSuccess(res, 'You are already subscribed to our newsletter', existingSubscription);
      } else {
        // Reactivate subscription
        await NewsletterSubscription.updateStatus(existingSubscription.id, 'active');
        const reactivated = await NewsletterSubscription.findById(existingSubscription.id);
        logger.info(`✅ Newsletter subscription reactivated: ${cleanEmail}`);

        // Prepare form data for notifications
        const reactivatedFormData = {
          'Email': cleanEmail,
          'Subscription ID': existingSubscription.id,
          'Status': 'Reactivated',
          'Subscription Time': reactivated.subscribed_at
        };

        // Send email notification (non-blocking)
        sendFormSubmissionEmail('Newsletter Subscription (Reactivated)', reactivatedFormData).catch(err => {
          logger.error('Email notification error (non-critical):', err.message);
        });

        // Send WhatsApp notification (non-blocking)
        sendFormSubmissionNotification('Newsletter Subscription (Reactivated)', reactivatedFormData).catch(err => {
          logger.error('WhatsApp notification error (non-critical):', err.message);
        });

        return sendSuccess(res, 'You have been resubscribed to our newsletter', reactivated);
      }
    }

    // Create new subscription
    const subscriptionId = await NewsletterSubscription.create({
      email: cleanEmail
    });

    logger.info(`✅ Newsletter subscription created: ID ${subscriptionId}, Email: ${cleanEmail}`);

    const subscription = await NewsletterSubscription.findById(subscriptionId);

    // Prepare form data for notifications
    const formData = {
      'Email': cleanEmail,
      'Subscription ID': subscriptionId,
      'Subscribed At': subscription.subscribed_at,
      'Submission Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Send email notification (non-blocking)
    sendFormSubmissionEmail('Newsletter Subscription', formData).catch(err => {
      logger.error('Email notification error (non-critical):', err.message);
    });

    // Send WhatsApp notification (non-blocking)
    sendFormSubmissionNotification('Newsletter Subscription', formData).catch(err => {
      logger.error('WhatsApp notification error (non-critical):', err.message);
    });

    return sendSuccess(res, 'Successfully subscribed to newsletter', subscription, 201);
  } catch (error) {
    logger.error('Error creating newsletter subscription:', error);

    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 'This email is already subscribed', 409);
    }

    next(error);
  }
};

/**
 * Get all subscriptions (Admin only)
 */
const getAllSubscriptions = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const subscriptions = await NewsletterSubscription.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return sendSuccess(res, 'Subscriptions retrieved successfully', subscriptions);
  } catch (error) {
    logger.error('Error retrieving newsletter subscriptions:', error);
    next(error);
  }
};

/**
 * Unsubscribe from newsletter (Public - no auth required)
 */
const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email address is required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      return sendError(res, 'Invalid email format', 400);
    }

    const success = await NewsletterSubscription.unsubscribe(cleanEmail);

    if (success) {
      logger.info(`✅ Newsletter unsubscribed: ${cleanEmail}`);
      return sendSuccess(res, 'Successfully unsubscribed from newsletter');
    } else {
      return sendError(res, 'Email not found in our subscription list', 404);
    }
  } catch (error) {
    logger.error('Error unsubscribing from newsletter:', error);
    next(error);
  }
};

module.exports = {
  subscribe,
  getAllSubscriptions,
  unsubscribe
};

