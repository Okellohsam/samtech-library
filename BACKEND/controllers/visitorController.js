const Visitor = require('../models/Visitor');

const trackVisitor = async (req, res) => {

  try {

    await Visitor.create({
      ipAddress: req.ip,
      pageVisited: req.body.page,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  trackVisitor
};