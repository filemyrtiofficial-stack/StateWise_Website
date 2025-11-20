/**
 * Main Routes Index
 * Combines all route modules
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const serviceRoutes = require('./serviceRoutes');
const stateRoutes = require('./stateRoutes');
const rtiApplicationRoutes = require('./rtiApplicationRoutes');
const consultationRoutes = require('./consultationRoutes');
const callbackRoutes = require('./callbackRoutes');
const paymentRoutes = require('./paymentRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const contactRoutes = require('./contactRoutes');
const careerRoutes = require('./careerRoutes');
const pdfRoutes = require('./pdfRoutes');

// API version prefix
const API_PREFIX = '/api/v1';

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/services`, serviceRoutes);
router.use(`${API_PREFIX}/states`, stateRoutes);
router.use(`${API_PREFIX}/rti-applications`, rtiApplicationRoutes);
router.use(`${API_PREFIX}/consultations`, consultationRoutes);
router.use(`${API_PREFIX}/callback-requests`, callbackRoutes);
router.use(`${API_PREFIX}/payments`, paymentRoutes);
router.use(`${API_PREFIX}/newsletter`, newsletterRoutes);
router.use(`${API_PREFIX}/contact`, contactRoutes);
router.use(`${API_PREFIX}/careers`, careerRoutes);
router.use(`${API_PREFIX}/pdf`, pdfRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check route paths
router.get('/debug/path', (req, res) => {
  res.status(200).json({
    success: true,
    originalUrl: req.originalUrl,
    url: req.url,
    path: req.path,
    baseUrl: req.baseUrl,
    message: 'Use this to verify the path received by backend'
  });
});

module.exports = router;

