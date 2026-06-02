const path = require('path');

const allowedMimeTypes = [
  'application/pdf'
];

const allowedExtensions = [
  '.pdf'
];

const validatePDF = (file) => {

  if (!file) {
    throw new Error('No file uploaded');
  }

  const ext = path.extname(file.originalname)
    .toLowerCase();

  if (
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    throw new Error(
      'Invalid file type. Only PDFs allowed.'
    );
  }

  if (!allowedExtensions.includes(ext)) {
    throw new Error(
      'Invalid file extension'
    );
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error(
      'PDF exceeds maximum size limit'
    );
  }

  return true;
};

module.exports = validatePDF;