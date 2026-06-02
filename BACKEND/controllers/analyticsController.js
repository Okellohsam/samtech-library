const PDF = require('../models/PDF');
const Visitor = require('../models/Visitor');

const getAnalytics = async (req, res) => {

  try {

    const totalPDFs = await PDF.countDocuments();

    const totalDownloadsData = await PDF.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$downloads' }
        }
      }
    ]);

    const totalVisitors = await Visitor.countDocuments();

    const topPDFs = await PDF.find()
      .sort({ downloads: -1 })
      .limit(5);

    res.json({
      totalPDFs,
      totalDownloads: totalDownloadsData[0]?.total || 0,
      totalVisitors,
      topPDFs
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  getAnalytics
};