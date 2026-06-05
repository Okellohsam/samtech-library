const streamifier = require('streamifier');

const cloudinary = require('../config/cloudinary');
const PDF = require('../models/PDF');

/*

# UPLOAD PDF

*/

const uploadPDF = async (req, res) => {

try {

const {
  title,
  description,
  author,
  category,
  subcategory
} = req.body;

/*
========================================
VALIDATE FILES
========================================
*/

if (
  !req.files ||
  !req.files.pdf ||
  !req.files.thumbnail
) {

  return res.status(400).json({

    success: false,

    message:
      'PDF and Thumbnail are required'

  });

}

const pdfFile =
  req.files.pdf[0];

const thumbnailFile =
  req.files.thumbnail[0];

/*
========================================
UPLOAD PDF TO CLOUDINARY
========================================
*/

const uploadPDFStream = () => {

  return new Promise(
    (resolve, reject) => {

      const uploadStream =
        cloudinary.uploader.upload_stream(

          {
            resource_type: 'raw',
            folder:
              'samtech-library/pdfs'
          },

          (error, result) => {

            if (error) {

              reject(error);

            } else {

              resolve(result);

            }

          }

        );

      streamifier
        .createReadStream(
          pdfFile.buffer
        )
        .pipe(uploadStream);

    }
  );

};

/*
========================================
UPLOAD THUMBNAIL TO CLOUDINARY
========================================
*/

const uploadThumbnailStream = () => {

  return new Promise(
    (resolve, reject) => {

      const uploadStream =
        cloudinary.uploader.upload_stream(

          {
            folder:
              'samtech-library/thumbnails'
          },

          (error, result) => {

            if (error) {

              reject(error);

            } else {

              resolve(result);

            }

          }

        );

      streamifier
        .createReadStream(
          thumbnailFile.buffer
        )
        .pipe(uploadStream);

    }
  );

};

const pdfResult =
  await uploadPDFStream();

const thumbResult =
  await uploadThumbnailStream();

/*
========================================
SAVE PDF
========================================
*/

const newPDF =
  await PDF.create({

    title,

    description,

    author,

    category,

    subcategory,

    pdfUrl:
      pdfResult.secure_url,

    thumbnail:
      thumbResult.secure_url,

    downloads: 0,

    views: 0

  });

/*
========================================
SUCCESS
========================================
*/

res.status(201).json({

  success: true,

  message:
    'PDF uploaded successfully',

  pdf: newPDF

});


} catch (error) {

console.error(
  'Upload PDF Error:',
  error
);

res.status(500).json({

  success: false,

  message:
    error.message

});

}

};

 /*

# GET ALL PDFs

*/

const getPDFs = async (
req,
res
) => {

try {

const pdfs =
  await PDF.find()
    .sort({
      createdAt: -1
    });

res.json(pdfs);


} catch (error) {


res.status(500).json({

  success: false,

  message:
    error.message

});


}

};

 /*

# TRACK DOWNLOAD

*/

const trackDownload = async (
req,
res
) => {

try {


const pdf =
  await PDF.findById(
    req.params.id
  );

if (!pdf) {

  return res.status(404).json({

    success: false,

    message:
      'PDF not found'

  });

}

pdf.downloads += 1;

await pdf.save();

res.json({

  success: true,

  downloadUrl:
    pdf.pdfUrl,

  filename:
    `${pdf.title}.pdf`

});


} catch (error) {


res.status(500).json({

  success: false,

  message:
    error.message

});


}

};

module.exports = {

uploadPDF,

getPDFs,

trackDownload

};
