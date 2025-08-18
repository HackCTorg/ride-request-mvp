const mongoose = require('mongoose');
const { RIDE_STATUSES } = require('../constants/rideStatuses');

const rideRequestSchema = new mongoose.Schema({
  rideRequestUuid: {
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
  status: {
    type: String,
    required: true,
    enum: Object.values(RIDE_STATUSES)
  },
  purpose: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false
  },
  timestamps: true
});

// Index for efficient queries
rideRequestSchema.index({ rideRequestUuid: 1 });

module.exports = mongoose.model('RideRequest', rideRequestSchema); 