const pdf = require('pdf-poppler');
const path = require('path');

const generateThumbnail = async (pdfPath) => {

  const outputDir = path.join(
    __dirname,
    '../uploads/temp'
  );

  const options = {
    format: 'png',
    out_dir: outputDir,
    out_prefix: 'thumb',
    page: 1
  };

  await pdf.convert(pdfPath, options);

  return path.join(
    outputDir,
    'thumb-1.png'
  );

};

module.exports = generateThumbnail;