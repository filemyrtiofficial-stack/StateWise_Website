/**
 * Email Service
 * Handles sending emails for form submissions
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');
const config = require('../config/env');

/**
 * Create email transporter
 */
const createTransporter = () => {
  // If SMTP is not configured, return null (email sending will be skipped)
  if (!config.EMAIL.SMTP_HOST || !config.EMAIL.SMTP_USER || !config.EMAIL.SMTP_PASSWORD) {
    logger.warn('Email service not configured. SMTP credentials missing.');
    return null;
  }

  // Remove quotes from username and password if present (common in .env files)
  const username = String(config.EMAIL.SMTP_USER).replace(/^["']|["']$/g, '');
  const password = String(config.EMAIL.SMTP_PASSWORD).replace(/^["']|["']$/g, '');
  const port = parseInt(config.EMAIL.SMTP_PORT, 10);
  const secure = config.EMAIL.SMTP_SECURE === 'true' || port === 465;

  logger.info('Creating email transporter:', {
    host: config.EMAIL.SMTP_HOST,
    port: port,
    secure: secure,
    user: username
  });

  return nodemailer.createTransport({
    host: config.EMAIL.SMTP_HOST,
    port: port,
    secure: secure, // true for 465 (SSL), false for other ports (TLS)
    auth: {
      user: username,
      pass: password
    }
  });
};

/**
 * Format form data into readable email body
 */
const formatFormData = (formData, formType) => {
  let body = `<h2>New ${formType} Submission</h2>\n\n`;
  body += `<table style="border-collapse: collapse; width: 100%; max-width: 600px;">\n`;

  for (const [key, value] of Object.entries(formData)) {
    if (value !== null && value !== undefined && value !== '') {
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      body += `<tr style="border-bottom: 1px solid #ddd;">\n`;
      body += `  <td style="padding: 8px; font-weight: bold; width: 30%;">${label}:</td>\n`;
      body += `  <td style="padding: 8px;">${String(value).replace(/\n/g, '<br>')}</td>\n`;
      body += `</tr>\n`;
    }
  }

  body += `</table>\n`;
  body += `\n<p style="margin-top: 20px; color: #666; font-size: 12px;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>`;

  return body;
};

/**
 * Send email notification for form submission
 * @param {string} formType - Type of form (e.g., 'Consultation', 'Callback Request', 'RTI Application')
 * @param {object} formData - The form data to include in the email
 * @returns {Promise<boolean>} - Returns true if email sent successfully, false otherwise
 */
const sendFormSubmissionEmail = async (formType, formData) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      logger.warn(`Email service not configured. Skipping email notification for ${formType}.`);
      return false;
    }

    const adminEmail = config.EMAIL.ADMIN_EMAIL || 'admin@filemyrti.com';

    // Remove quotes from username if present
    const fromEmail = String(config.EMAIL.SMTP_USER).replace(/^["']|["']$/g, '');

    const mailOptions = {
      from: `"FileMyRTI Forms" <${fromEmail}>`,
      to: adminEmail,
      subject: `New Form Submission - ${formType}`,
      html: formatFormData(formData, formType)
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ Email notification sent for ${formType} submission:`, {
      messageId: info.messageId,
      to: adminEmail
    });

    return true;
  } catch (error) {
    // Log error but don't throw - form submission should not fail due to email issues
    logger.error(`❌ Failed to send email notification for ${formType}:`, {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};

module.exports = {
  sendFormSubmissionEmail,
  createTransporter
};

