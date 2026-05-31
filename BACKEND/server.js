 
/*
====================================
LOAD ENV VARIABLES FIRST
====================================
*/
const dotenv = require('dotenv');

require('dotenv').config({
  path: require('path').resolve(
    __dirname,
    '.env'
  )
});


console.log(
  'CLOUDINARY KEY:',
  process.env.CLOUDINARY_API_KEY
);

/*
====================================
IMPORTS
====================================
*/

const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const rateLimit =
require('express-rate-limit');

const morgan = require('morgan');

const path = require('path');

/*
====================================
CONFIG FILES
====================================
*/

const connectDB =
require('./config/db');

const Cloudinary = require('./config/cloudinary');

/*
====================================
ROUTES
====================================
*/

const pdfRoutes =
require('./routes/pdfRoutes');

const adminRoutes =
require('./routes/adminRoutes');

const analyticsRoutes =
require('./routes/analyticsRoutes');

const visitorRoutes =
require('./routes/visitorRoutes');

/*
====================================
MIDDLEWARE
====================================
*/

const {
  notFound,
  errorHandler
} = require(
  './middleware/errorMiddleware'
);
 


/*
====================================
ENV CONFIG
====================================
*/
 dotenv.config();

/*
====================================
DATABASE CONNECTION
====================================
*/

connectDB();

/*
====================================
INITIALIZE EXPRESS
====================================
*/

const app = express();

/*
====================================
SECURITY MIDDLEWARE
====================================
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin: '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ],
    credentials: true
  })
);

/*
====================================
RATE LIMITER
====================================
*/

const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 300,

  message: {
    success: false,
    message:
      'Too many requests. Please try again later.'
  }

});

app.use(limiter);

/*
====================================
BODY PARSER
====================================
*/

app.use(
  express.json({
    limit: '50mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb'
  })
);

/*
====================================
LOGGER
====================================
*/

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/*
====================================
STATIC DIRECTORIES
====================================
*/

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);

/*
====================================
API ROUTES
====================================
*/

app.use('/api/pdfs', pdfRoutes);

app.use('/api/admin', adminRoutes);

app.use(
  '/api/analytics',
  analyticsRoutes
);

app.use(
  '/api/visitors',
  visitorRoutes
);

/*
====================================
ROOT ROUTE
====================================
*/

app.get('/', (req, res) => {

  res.status(200).json({

    success: true,

    application: 'SAMTECH LIBRARY',

    company: 'SAMTECH SECURITY',

    status: 'SERVER RUNNING',

    version: '1.0.0',

    timestamp: new Date()

  });

});

/*
====================================
STATUS ROUTE
====================================
*/

app.get('/api/status', (req, res) => {

  res.status(200).json({

    success: true,

    database: 'Connected',

    environment:
      process.env.NODE_ENV,

    uptime: process.uptime(),

    memoryUsage:
      process.memoryUsage(),

    timestamp: new Date()

  });

});

/*
====================================
404 HANDLER
====================================
*/

app.use(notFound);

/*
====================================
GLOBAL ERROR HANDLER
====================================
*/

app.use(errorHandler);

/*
====================================
PORT
====================================
*/

const PORT =
  process.env.PORT || 5000;

/*
====================================
START SERVER
====================================
*/

app.listen(PORT, () => {

  console.log(`

====================================
SAMTECH LIBRARY SERVER STARTED
====================================

PORT: ${PORT}

MODE: ${process.env.NODE_ENV}

STATUS: RUNNING

CLOUD: ${process.env.CLOUDINARY_API_KEY}
====================================

  `);

});