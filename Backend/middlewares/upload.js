/**
 * File Upload Middleware using Multer
 * Handles file uploads for career applications
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Try to require logger, but don't fail if it doesn't exist
let logger;
try {
  logger = require('../utils/logger');
} catch (err) {
  // Fallback logger if utils/logger doesn't exist
  logger = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
  };
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`📁 Created uploads directory: ${uploadsDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const allowedExts = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for single file upload (resume) with error handling
const uploadResume = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
      // Handle other errors (like fileFilter errors)
      return res.status(400).json({
        success: false,
        message: err.message || 'Invalid file type'
      });
    }
    next();
  });
};

module.exports = {
  uploadResume,
  uploadsDir
};

