const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({

  pdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PDF',
    required: true
  },

  ipAddress: {
    type: String
  },

  country: {
    type: String,
    default: 'Unknown'
  },

  city: {
    type: String,
    default: 'Unknown'
  },

  device: {
    type: String,
    default: 'Unknown'
  },

  browser: {
    type: String,
    default: 'Unknown'
  },

  downloadedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  'Download',
  downloadSchema
);