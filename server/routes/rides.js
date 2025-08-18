const express = require('express');
const { body, validationResult } = require('express-validator');
const Ride = require('../models/Ride');
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

    const ride = new Ride({
      rider: req.user._id,
      pickupLocation,
      destination,
      notes,
      estimatedDuration,
      estimatedDistance,
      fare: {
        amount: estimatedFare,
        currency: 'USD'
      }
    });

    await ride.save();

    res.status(201).json({
      message: 'Ride requested successfully',
      ride
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
    
    if (req.user.role === 'rider') {
      query.rider = req.user._id;
    } else if (req.user.role === 'driver') {
      query.driver = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate('rider', 'name email phone')
      .populate('driver', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ride.countDocuments(query);

    res.json({
      rides,
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

// Get available rides for drivers
router.get('/available', auth, authorize('driver'), async (req, res) => {
  try {
    const rides = await Ride.find({ 
      status: 'pending',
      driver: { $exists: false }
    })
    .populate('rider', 'name phone')
    .sort({ requestTime: -1 });

    res.json(rides);
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a ride (driver)
router.put('/:rideId/accept', auth, authorize('driver'), async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is not available' });
    }

    if (ride.driver) {
      return res.status(400).json({ message: 'Ride already accepted' });
    }

    ride.driver = req.user._id;
    ride.status = 'accepted';
    await ride.save();

    res.json({
      message: 'Ride accepted successfully',
      ride
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ride status
router.put('/:rideId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is authorized to update this ride
    if (ride.rider.toString() !== req.user._id.toString() && 
        ride.driver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status and timestamps
    ride.status = status;
    if (status === 'in-progress') {
      ride.pickupTime = new Date();
    } else if (status === 'completed') {
      ride.dropoffTime = new Date();
    }

    await ride.save();

    res.json({
      message: 'Ride status updated successfully',
      ride
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a completed ride
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
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed rides' });
    }

    ride.rating = rating;
    ride.review = review;
    await ride.save();

    res.json({
      message: 'Ride rated successfully',
      ride
    });
  } catch (error) {
    console.error('Rate ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ride by ID
router.get('/:rideId', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('rider', 'name email phone')
      .populate('driver', 'name email phone');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is authorized to view this ride
    if (ride.rider.toString() !== req.user._id.toString() && 
        ride.driver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(ride);
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 