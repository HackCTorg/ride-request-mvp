const mongoose = require('mongoose');
const { RIDE_STATUSES } = require('../constants/rideStatuses');
const { RIDE_REQUEST_STATUSES } = require('../constants/rideRequestStatuses');

const rideRequestSchema = new mongoose.Schema({
  uuid: {
    type: Number,
    required: true,
    unique: true
  },
  serviceUserUuid: {
    type: String,
    required: true
  },
  serviceUserRole: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  dropOffAddress: {
    type: String,
    required: true
  },
  assignedVehicleUuid: {
    type: Number,
    required: false
  },
  assignedDriverUuid: {
    type: Number,
    required: false
  },
  roundTrip: {
    type: Boolean,
    required: true
  },
  pickupRequestedTime: {
    type: String,
    required: true
  },
  dropOffRequestedTime: {
    type: String,
    required: true
  },
  rideStartedActualTime: {
    type: Date,
    required: true
  },
  pickupActualTime: {
    type: Date,
    required: true
  },
  dropOffActualTime: {
    type: Date,
    required: true
  },
  roundTripReturnStartedActualTime: {
    type: Date,
    required: false
  },
  roundTripReturnCompletedActualTime: {
    type: Date,
    required: false
  },
  rideCompleteRequestedTime: {
    type: Date,
    required: true
  },
  rideCompleteActualTime: {
    type: Date,
    required: true
  },
  rideStatus: {
    type: Number,
    required: true,
    enum: Object.values(RIDE_STATUSES)
  },
  purpose: {
    type: String,
    required: true,
  },
  rideRequestStatus: {
    type: Number,
    required: true,
    enum: Object.values(RIDE_REQUEST_STATUSES)
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
rideRequestSchema.index({ uuid: 1 });

module.exports = mongoose.model('RideRequest', rideRequestSchema); 