/**
 * WhatsApp Notification Service using whatsapp-web.js
 * FREE solution - No paid APIs, uses WhatsApp Web
 * 
 * Features:
 * - QR code displayed in terminal ONLY (no browser window)
 * - Session persistence (auto-saved)
 * - Auto-restart on crashes
 * - Clean and simple implementation
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const logger = require('../logger');
const config = require('../../config/env');

// Session directory
const SESSION_DIR = path.join(__dirname, '.wwebjs_auth');

// Global state
let client = null;
let isReady = false;
let isInitializing = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds

/**
 * Initialize WhatsApp Web connection
 */
async function initializeWhatsApp() {
  if (isInitializing) {
    logger.info('⏳ WhatsApp initialization already in progress...');
    return;
  }

  if (isReady && client) {
    logger.info('✅ WhatsApp already initialized');
    return;
  }

  isInitializing = true;
  reconnectAttempts = 0;

  try {
    logger.info('🚀 Initializing WhatsApp Web...');

    // Create WhatsApp client with local auth (session persistence)
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: SESSION_DIR
      }),
      puppeteer: {
        headless: true, // Run in background, no browser window
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      }
    });

    // Event: QR code received - display in terminal
    client.on('qr', (qr) => {
      logger.info('\n📱 ========================================');
      logger.info('📱 WhatsApp QR Code - Scan with your phone');
      logger.info('📱 ========================================\n');
      logger.info('📋 Instructions:');
      logger.info('   1. Open WhatsApp on your phone');
      logger.info('   2. Go to Settings → Linked Devices');
      logger.info('   3. Tap "Link a Device"');
      logger.info('   4. Scan the QR code below\n');

      // Display QR code in terminal
      qrcode.generate(qr, { small: true });

      logger.info('\n⏳ Waiting for QR code scan...\n');
    });

    // Event: Loading screen
    client.on('loading_screen', (percent, message) => {
      logger.info(`⏳ Loading... ${percent}% - ${message}`);
    });

    // Event: WhatsApp is ready
    client.on('ready', () => {
      logger.info('✅ WhatsApp client is ready!');
      logger.info('📱 You can now send messages!\n');
      isReady = true;
      isInitializing = false;
      reconnectAttempts = 0;
    });

    // Event: Authentication successful
    client.on('authenticated', () => {
      logger.info('✅ WhatsApp authenticated successfully');
    });

    // Event: Authentication failure
    client.on('auth_failure', (msg) => {
      logger.error('❌ WhatsApp authentication failed:', msg);
      isReady = false;
      isInitializing = false;
      handleReconnect();
    });

    // Event: Disconnected
    client.on('disconnected', (reason) => {
      logger.warn('⚠️  WhatsApp disconnected:', reason);
      isReady = false;
      client = null;
      handleReconnect();
    });

    // Event: Error
    client.on('error', (error) => {
      logger.error('❌ WhatsApp error:', error.message);
    });

    // Initialize the client
    await client.initialize();

  } catch (error) {
    logger.error('❌ Failed to initialize WhatsApp:', error.message);
    isInitializing = false;
    isReady = false;

    // Clean up
    if (client) {
      try {
        await client.destroy();
      } catch (e) { }
      client = null;
    }

    // Attempt reconnection
    handleReconnect();
  }
}

/**
 * Handle reconnection on crash/disconnect
 */
async function handleReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    logger.error(`❌ Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Please restart the server.`);
    return;
  }

  reconnectAttempts++;
  const delay = RECONNECT_DELAY * reconnectAttempts; // Exponential backoff

  logger.info(`🔄 Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${delay / 1000} seconds...`);

  setTimeout(async () => {
    await initializeWhatsApp();
  }, delay);
}

/**
 * Send WhatsApp message to a phone number
 * @param {string} phone - Phone number in format +91XXXXXXXXXX
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Returns true if message sent successfully
 */
async function sendWhatsAppMessage(phone, message) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Ensure WhatsApp is initialized
      if (!isReady || !client) {
        logger.warn('⚠️  WhatsApp not ready. Initializing...');
        await initializeWhatsApp();

        // Wait for WhatsApp to be ready (max 60 seconds)
        let waitAttempts = 0;
        while (!isReady && waitAttempts < 60) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          waitAttempts++;
        }

        if (!isReady || !client) {
          throw new Error('WhatsApp initialization failed or timed out');
        }
      }

      logger.info(`📤 Sending WhatsApp message to ${phone}...`);

      // Format phone number (remove spaces, ensure country code)
      let cleanPhone = phone.replace(/\s+/g, '').replace(/^\+?/, '');

      // If phone doesn't start with country code, assume it's Indian number
      if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      // Add @c.us suffix for WhatsApp Web format
      const chatId = `${cleanPhone}@c.us`;

      // Send message
      const result = await client.sendMessage(chatId, message);

      if (result) {
        logger.info(`✅ WhatsApp message sent successfully to ${phone}`);
        return true;
      } else {
        throw new Error('Message send returned no result');
      }

    } catch (error) {
      retryCount++;
      logger.error(`❌ Failed to send WhatsApp message (attempt ${retryCount}/${maxRetries}):`, error.message);

      if (retryCount < maxRetries) {
        logger.info(`🔄 Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Try to reinitialize if client is dead
        if (!client || !isReady) {
          logger.info('🔄 Reinitializing WhatsApp connection...');
          isReady = false;
          await initializeWhatsApp();
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } else {
        logger.error(`❌ Failed to send WhatsApp message after ${maxRetries} attempts`);
        return false;
      }
    }
  }

  return false;
}

/**
 * Format form data into WhatsApp message
 */
function formatFormMessage(formType, formData) {
  let message = `📋 *New ${formType} Submission*\n\n`;

  for (const [key, value] of Object.entries(formData)) {
    if (value !== null && value !== undefined && value !== '') {
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      message += `*${label}:* ${String(value)}\n`;
    }
  }

  message += `\n⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  return message;
}

/**
 * Send form submission notification via WhatsApp
 * @param {string} formType - Type of form (e.g., 'RTI Application', 'Consultation')
 * @param {object} formData - Form data object
 * @returns {Promise<boolean>}
 */
async function sendFormSubmissionNotification(formType, formData) {
  try {
    const whatsappPhone = config.WHATSAPP?.NOTIFICATION_PHONE;

    if (!whatsappPhone) {
      logger.warn('⚠️  WhatsApp notification phone not configured. Skipping WhatsApp notification.');
      return false;
    }

    const message = formatFormMessage(formType, formData);
    return await sendWhatsAppMessage(whatsappPhone, message);
  } catch (error) {
    logger.error('❌ Failed to send WhatsApp form notification:', error.message);
    return false;
  }
}

/**
 * Close WhatsApp connection gracefully
 */
async function closeWhatsApp() {
  try {
    logger.info('🔌 Closing WhatsApp connection...');

    if (client) {
      await client.destroy();
      client = null;
    }

    isReady = false;
    logger.info('✅ WhatsApp connection closed');
  } catch (error) {
    logger.error('❌ Error closing WhatsApp connection:', error.message);
  }
}

// Export functions
module.exports = {
  initializeWhatsApp,
  sendWhatsAppMessage,
  sendFormSubmissionNotification,
  formatFormMessage,
  closeWhatsApp,
  isReady: () => isReady
};
