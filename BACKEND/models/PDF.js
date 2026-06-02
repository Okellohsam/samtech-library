
const mongoose = require('mongoose');

const pdfSchema =
new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  author: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  subcategory: {
    type: String,
    required: true
  },

  pdfUrl: {
    type: String,
    required: true
  },

  thumbnail: {
    type: String
  },

  downloads: {
    type: Number,
    default: 0
  },

  views: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  'PDF',
  pdfSchema
);

