const mongoose = require('mongoose');

const visitorSchema = mongoose.Schema({

  ipAddress: {
    type: String
  },

  pageVisited: {
    type: String,
    required: true
  },

  userAgent: {
    type: String
  },

  referrer: {
    type: String,
    default: 'Direct'
  },

  country: {
    type: String,
    default: 'Unknown'
  },

  city: {
    type: String,
    default: 'Unknown'
  },

  visitDate: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  'Visitor',
  visitorSchema
);
