const PDF = require('../models/PDF');
const Visitor = require('../models/Visitor');
const Download = require('../models/Download');

const getDashboardAnalytics = async () => {

  const totalPDFs = await PDF.countDocuments();

  const totalVisitors =
    await Visitor.countDocuments();

  const totalDownloads =
    await Download.countDocuments();

  const trendingPDFs = await PDF.find()
    .sort({ downloads: -1 })
    .limit(5);

  const latestPDFs = await PDF.find()
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalPDFs,
    totalVisitors,
    totalDownloads,
    trendingPDFs,
    latestPDFs
  };
};

module.exports = {
  getDashboardAnalytics
};