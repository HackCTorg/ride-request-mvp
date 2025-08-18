const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationUuid: {
    type: Number,
    required: true,
    unique: true
  },
  locationName: {
    type: String,
    required: true
  },
  googleLatLong: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  googleMapsUrl: {
    type: String,
    required: true
  },
  googleMapsAddress: {
    type: String,
    required: true
  },
  timestamps: true
});

// Index for efficient queries
locationSchema.index({ locationUuid: 1 });

module.exports = mongoose.model('Location', locationSchema); 