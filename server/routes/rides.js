const express = require('express');
const { body, validationResult } = require('express-validator');
const RideRequest = require('../models/RideRequest');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Request a new ride
router.post('/', auth, authorize('rider'), [
  body('pickupLocation.address').notEmpty().withMessage('Pickup location is required'),
  body('destination.address').notEmpty().withMessage('Destination is required'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickupLocation, destination, notes, estimatedDuration, estimatedDistance } = req.body;

    // Calculate estimated fare (basic calculation)
    const baseFare = 5;
    const perKmRate = 2;
    const estimatedFare = baseFare + (estimatedDistance * perKmRate);

    const rideRequest = new RideRequest({
      uuid: Date.now(), // Generate a unique UUID
      serviceUserUuid: req.user.uuid,
      serviceUserRole: req.user.serviceUserRole[0], // Take first role
      pickupAddress: pickupLocation.address,
      dropOffAddress: destination.address,
      notes,
      roundTrip: false, // Default to false, can be made configurable
      pickupRequestedTime: new Date().toISOString(),
      dropOffRequestedTime: new Date().toISOString(),
      rideStartedActualTime: new Date(),
      pickupActualTime: new Date(),
      dropOffActualTime: new Date(),
      rideCompleteRequestedTime: new Date(),
      rideCompleteActualTime: new Date(),
      rideStatus: 0, // REQUEST_IN_PROGRESS
      purpose: 'General transportation',
      rideRequestStatus: 100 // ALL_RIDE_REQUEST_OPEN
    });

    await rideRequest.save();

    res.status(201).json({
      message: 'Ride request created successfully',
      rideRequest
    });
  } catch (error) {
    console.error('Request ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ride history
router.get('/my-rides', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.user.serviceUserRole.includes('rider')) {
      query.serviceUserUuid = req.user.uuid;
    } else if (req.user.serviceUserRole.includes('driver')) {
      query.assignedDriverUuid = req.user.uuid;
    }

    if (status) {
      query.status = status;
    }

    const rideRequests = await RideRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await RideRequest.countDocuments(query);

    res.json({
      rideRequests,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available ride requests for drivers
router.get('/available', auth, authorize('driver'), async (req, res) => {
  try {
    const rideRequests = await RideRequest.find({ 
      rideRequestStatus: 100, // ALL_RIDE_REQUEST_OPEN
      assignedDriverUuid: { $exists: false }
    })
    .sort({ createdAt: -1 });

    res.json(rideRequests);
  } catch (error) {
    console.error('Get available ride requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a ride request (driver)
router.put('/:rideId/accept', auth, authorize('driver'), async (req, res) => {
  try {
    const rideRequest = await RideRequest.findOne({ uuid: req.params.rideId });
    
    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (rideRequest.rideRequestStatus !== 100) { // ALL_RIDE_REQUEST_OPEN
      return res.status(400).json({ message: 'Ride request is not available' });
    }

    if (rideRequest.assignedDriverUuid) {
      return res.status(400).json({ message: 'Ride request already accepted' });
    }

    rideRequest.assignedDriverUuid = req.user.uuid;
    rideRequest.rideRequestStatus = 200; // DRIVER_NEEDED
    await rideRequest.save();

    res.json({
      message: 'Ride request accepted successfully',
      rideRequest
    });
  } catch (error) {
    console.error('Accept ride request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ride request status
router.put('/:rideId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const rideRequest = await RideRequest.findOne({ uuid: req.params.rideId });

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    // Check if user is authorized to update this ride request
    if (rideRequest.serviceUserUuid !== req.user.uuid && 
        rideRequest.assignedDriverUuid !== req.user.uuid) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status and timestamps
    rideRequest.rideStatus = status;
    if (status === 200) { // RIDE_STARTED
      rideRequest.rideStartedActualTime = new Date();
    } else if (status === 500) { // RIDE_COMPLETE
      rideRequest.rideCompleteActualTime = new Date();
    }

    await rideRequest.save();

    res.json({
      message: 'Ride request status updated successfully',
      rideRequest
    });
  } catch (error) {
    console.error('Update ride request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a completed ride request
router.post('/:rideId/rate', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review } = req.body;
    const rideRequest = await RideRequest.findOne({ uuid: req.params.rideId });

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (rideRequest.serviceUserUuid !== req.user.uuid) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (rideRequest.rideStatus !== 500) { // RIDE_COMPLETE
      return res.status(400).json({ message: 'Can only rate completed ride requests' });
    }

    // Note: Rating and review fields don't exist in RideRequest model yet
    // You may need to add these fields to the schema
    res.json({
      message: 'Rating functionality not yet implemented for ride requests'
    });
  } catch (error) {
    console.error('Rate ride request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ride request by ID
router.get('/:rideId', auth, async (req, res) => {
  try {
    const rideRequest = await RideRequest.findOne({ uuid: req.params.rideId });

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    // Check if user is authorized to view this ride request
    if (rideRequest.serviceUserUuid !== req.user.uuid && 
        rideRequest.assignedDriverUuid !== req.user.uuid) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(rideRequest);
  } catch (error) {
    console.error('Get ride request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 