const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['csv', 'xlsx'],
    required: true
  },
  columns: {
    type: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      description: { type: String, default: '' }
    }],
    default: []
  },
  rowCount: {
    type: Number,
    required: true
  },
  previewData: {
    type: Array,
    default: []
  },
  processedData: {
    type: String,  // Path to processed CSV file
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'error'],
    default: 'processing'
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
datasetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dataset', datasetSchema);