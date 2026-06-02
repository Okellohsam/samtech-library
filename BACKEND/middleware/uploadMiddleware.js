
const multer = require('multer');

/*
========================================
MEMORY STORAGE
========================================
*/

const storage = multer.memoryStorage();

/*
========================================
FILE FILTER
========================================
*/

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype === 'application/pdf'
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        'Only PDF files are allowed'
      ),
      false
    );

  }

};

/*
========================================
UPLOAD CONFIG
========================================
*/

const upload = multer({

  storage,

  limits: {
    fileSize:
    50 * 1024 * 1024
  },

  fileFilter

});

module.exports = upload;
