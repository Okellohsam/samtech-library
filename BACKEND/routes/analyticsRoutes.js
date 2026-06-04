const express =
  require('express');

const router =
  express.Router();

const {

  getAnalytics,

  getDownloads

} = require(
  '../controllers/analyticsController'
);

const {
  protect
} = require(
  '../middleware/authMiddleware'
);

/*
====================================
ANALYTICS
====================================
*/

router.get(
  '/',
  protect,
  getAnalytics
);

/*
====================================
DOWNLOAD HISTORY
====================================
*/

router.get(
  '/downloads',
  protect,
  getDownloads
);

module.exports =
  router;
