const express = require('express');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

const {
  uploadPDF,
  getPDFs,
  trackDownload
} = require('../controllers/pdfController');

const {
  protect
} = require('../middleware/authMiddleware');

/*
====================================
PUBLIC ROUTES
====================================
*/

// Fetch all PDFs
router.get('/', getPDFs);

// Download PDF
router.get(
  '/download/:id',
  trackDownload
);

/*
====================================
ADMIN ROUTES
====================================
*/

// Upload PDF
router.post(
  '/',
  protect,
  upload.single('pdf'),
  uploadPDF
);

module.exports = router;