const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  uuid: {
    type: Number,
    required: true,
    unique: true
  },
  fleetId: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  serviceArea: {
    type: String,
    required: true
  },
  accessiblilityFeatures: {
    type: [String],
    required: true,
    enum: ['wheelchair', 'prone seating']
  }
}, {
  timestamps: true
});

// Index for efficient queries
vehicleSchema.index({ uuid: 1 });
vehicleSchema.index({ fleetId: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema); 