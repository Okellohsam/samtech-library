 
const path = require('path');
const fs = require('fs');
const streamifier = require('streamifier');
const pdf = require('pdf-poppler');

const cloudinary = require('../config/cloudinary');

const PDF = require('../models/PDF');

const optimizeImage = require(
  '../utils/optimizeImage'
);

/*
========================================
UPLOAD PDF
========================================
*/

const uploadPDF = async (req, res) => {

  let pdfPath = null;
  let generatedThumb = null;
  let optimizedThumb = null;

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
    VALIDATE FILE
    ========================================
    */

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: 'No PDF uploaded'
      });

    }

    /*
    ========================================
    TEMP DIRECTORY
    ========================================
    */

    const tempDir = path.join(
      __dirname,
      '../uploads/temp'
    );

    if (!fs.existsSync(tempDir)) {

      fs.mkdirSync(tempDir, {
        recursive: true
      });

    }

    /*
    ========================================
    SAVE PDF TEMP FILE
    ========================================
    */

    const timestamp = Date.now();

    pdfPath = path.join(
      tempDir,
      `${timestamp}.pdf`
    );

    fs.writeFileSync(
      pdfPath,
      req.file.buffer
    );

    /*
    ========================================
    GENERATE THUMBNAIL
    ========================================
    */

    const outputPrefix =
      `thumb-${timestamp}`;

    const options = {

      format: 'png',

      out_dir: tempDir,

      out_prefix: outputPrefix,

      page: 1

    };

    await pdf.convert(
      pdfPath,
      options
    );

    /*
    ========================================
    FIND GENERATED THUMBNAIL
    ========================================
    */

    const generatedFiles =
      fs.readdirSync(tempDir);

    const thumbnailFile =
      generatedFiles.find(file => {

        return (
          file.startsWith(outputPrefix) &&
          file.endsWith('.png')
        );

      });

    if (!thumbnailFile) {

      throw new Error(
        'Thumbnail generation failed'
      );

    }

    generatedThumb = path.join(
      tempDir,
      thumbnailFile
    );

    console.log(
      'Generated Thumbnail:',
      generatedThumb
    );

    /*
    ========================================
    OPTIMIZE THUMBNAIL
    ========================================
    */

    optimizedThumb = path.join(
      tempDir,
      `optimized-${outputPrefix}.png`
    );

    await optimizeImage(
      generatedThumb,
      optimizedThumb
    );

    /*
    ========================================
    UPLOAD PDF TO CLOUDINARY
    ========================================
    */

    const uploadPDFStream = () => {

      return new Promise(
        (resolve, reject) => {

          const stream =
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
              req.file.buffer
            )
            .pipe(stream);

        }
      );

    };

    const pdfResult =
      await uploadPDFStream();

    /*
    ========================================
    UPLOAD THUMBNAIL
    ========================================
    */

    const thumbResult =
      await cloudinary.uploader.upload(

        optimizedThumb,

        {
          folder:
          'samtech-library/thumbnails'
        }

      );

    /*
    ========================================
    SAVE PDF TO DATABASE
    ========================================
    */

    const newPDF = await PDF.create({

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
    CLEAN TEMP FILES
    ========================================
    */

    if (
      pdfPath &&
      fs.existsSync(pdfPath)
    ) {

      fs.unlinkSync(pdfPath);

    }

    if (
      generatedThumb &&
      fs.existsSync(generatedThumb)
    ) {

      fs.unlinkSync(generatedThumb);

    }

    if (
      optimizedThumb &&
      fs.existsSync(optimizedThumb)
    ) {

      fs.unlinkSync(optimizedThumb);

    }

    /*
    ========================================
    SUCCESS RESPONSE
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

    /*
    ========================================
    CLEANUP ON ERROR
    ========================================
    */

    if (
      pdfPath &&
      fs.existsSync(pdfPath)
    ) {

      fs.unlinkSync(pdfPath);

    }

    if (
      generatedThumb &&
      fs.existsSync(generatedThumb)
    ) {

      fs.unlinkSync(generatedThumb);

    }

    if (
      optimizedThumb &&
      fs.existsSync(optimizedThumb)
    ) {

      fs.unlinkSync(optimizedThumb);

    }

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

/*
========================================
GET ALL PDFs
========================================
*/

const getPDFs = async (
  req,
  res
) => {

  try {

    const pdfs = await PDF.find()

      .sort({
        createdAt: -1
      });

    res.json(pdfs);

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

/*
========================================
TRACK DOWNLOAD
========================================
*/

const trackDownload = async (
  req,
  res
) => {

  try {

    const pdf = await PDF.findById(
      req.params.id
    );

    if (!pdf) {

      return res.status(404).json({

        success: false,

        message: 'PDF not found'

      });

    }

    /*
    ========================================
    INCREMENT DOWNLOADS
    ========================================
    */

    pdf.downloads += 1;

    await pdf.save();

    /*
    ========================================
    RETURN DOWNLOAD URL
    ========================================
    */

    res.json({

      success: true,

      downloadUrl:
      pdf.pdfUrl

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

module.exports = {

  uploadPDF,

  getPDFs,

  trackDownload

};
 

