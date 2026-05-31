
const sharp = require('sharp');
const fs = require('fs');

const optimizeImage = async (
  inputPath,
  outputPath
) => {

  try {

    // CHECK IF FILE EXISTS

    if (!fs.existsSync(inputPath)) {

      throw new Error(
        `Input file missing: ${inputPath}`
      );

    }

    await sharp(inputPath)

      .resize({
        width: 500
      })

      .png({
        quality: 80
      })

      .toFile(outputPath);

    return outputPath;

  } catch (error) {

    console.error(
      'Optimize Image Error:',
      error.message
    );

    throw error;

  }

};

module.exports = optimizeImage
