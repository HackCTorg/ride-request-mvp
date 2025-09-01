// Ride Status Constants
// ** means the ride request status will change to closed upon achieving this ride status
// Many of these indicate a bad condition

const RIDE_STATUSES = {
  // Initial and Confirmation States
  REQUEST_IN_PROGRESS: 0,        // Ride Request In Progress
  RIDE_CONFIRMED: 100,           // Ride Confirmed
  
  // Cancellation States
  RIDE_CANCELED_BY_RIDER: 109,   // Ride Canceled by Rider
  
  // Active Ride States
  RIDE_STARTED: 200,             // Ride Started
  RIDE_INTERRUPTED: 209,         // Ride Interrupted *
  
  // Pickup States
  RIDER_PICKED_UP: 300,          // Rider Picked Up
  RIDER_NOT_PICKED_UP: 309,      // Rider Not Picked Up *
  
  // Dropoff States
  RIDER_DROPPED_OFF: 400,        // Rider Dropped Off
  RIDER_NOT_DROPPED_OFF: 409,    // Rider Not Dropped Off *
  
  // Roundtrip States
  ROUNDTRIP_RETURNING: 450,              // Roundtrip Returning
  ROUNDTRIP_RETURN_INTERRUPTED: 459,     // Roundtrip Return Interrupted *
  ROUNDTRIP_COMPLETE: 475,               // Roundtrip Complete
  ROUNDTRIP_COMPLETION_INTERRUPTED: 479, // Roundtrip Completion Interrupted *
  
  // Final States
  RIDE_COMPLETE: 500,            // Ride Complete
  RIDE_INCOMPLETE: 509           // Ride Incomplete
};

// Status categories for easier management
const STATUS_CATEGORIES = {
  REQUEST: [RIDE_STATUSES.REQUEST_IN_PROGRESS],
  CONFIRMATION: [RIDE_STATUSES.RIDE_CONFIRMED],
  CANCELLATION: [RIDE_STATUSES.RIDE_CANCELED_BY_RIDER],
  ACTIVE: [RIDE_STATUSES.RIDE_STARTED, RIDE_STATUSES.RIDE_INTERRUPTED],
  PICKUP: [RIDE_STATUSES.RIDER_PICKED_UP, RIDE_STATUSES.RIDER_NOT_PICKED_UP],
  DROPOFF: [RIDE_STATUSES.RIDER_DROPPED_OFF, RIDE_STATUSES.RIDER_NOT_DROPPED_OFF],
  ROUNDTRIP: [
    RIDE_STATUSES.ROUNDTRIP_RETURNING,
    RIDE_STATUSES.ROUNDTRIP_RETURN_INTERRUPTED,
    RIDE_STATUSES.ROUNDTRIP_COMPLETE,
    RIDE_STATUSES.ROUNDTRIP_COMPLETION_INTERRUPTED
  ],
  COMPLETION: [RIDE_STATUSES.RIDE_COMPLETE, RIDE_STATUSES.RIDE_INCOMPLETE]
};

// Statuses that indicate the ride request should be closed
const CLOSING_STATUSES = [
  RIDE_STATUSES.RIDE_CANCELED_BY_RIDER,
  RIDE_STATUSES.RIDE_INTERRUPTED,
  RIDE_STATUSES.RIDER_NOT_PICKED_UP,
  RIDE_STATUSES.RIDER_NOT_DROPPED_OFF,
  RIDE_STATUSES.ROUNDTRIP_RETURN_INTERRUPTED,
  RIDE_STATUSES.ROUNDTRIP_COMPLETION_INTERRUPTED,
  RIDE_STATUSES.RIDE_COMPLETE,
  RIDE_STATUSES.ROUNDTRIP_COMPLETE,
  RIDE_STATUSES.RIDE_INCOMPLETE
];

// Statuses that indicate a bad condition
const PROBLEMATIC_STATUSES = [
  RIDE_STATUSES.RIDE_CANCELED_BY_RIDER,
  RIDE_STATUSES.RIDE_INTERRUPTED,
  RIDE_STATUSES.RIDER_NOT_PICKED_UP,
  RIDE_STATUSES.RIDER_NOT_DROPPED_OFF,
  RIDE_STATUSES.ROUNDTRIP_RETURN_INTERRUPTED,
  RIDE_STATUSES.ROUNDTRIP_COMPLETION_INTERRUPTED,
  RIDE_STATUSES.RIDE_INCOMPLETE
];

// Helper functions
const isClosingStatus = (status) => CLOSING_STATUSES.includes(status);
const isProblematicStatus = (status) => PROBLEMATIC_STATUSES.includes(status);
const isValidStatus = (status) => Object.values(RIDE_STATUSES).includes(status);

// Get status description
const getStatusDescription = (status) => {
  const descriptions = {
    [RIDE_STATUSES.REQUEST_IN_PROGRESS]: 'Ride Request In Progress',
    [RIDE_STATUSES.RIDE_CONFIRMED]: 'Ride Confirmed',
    [RIDE_STATUSES.RIDE_CANCELED_BY_RIDER]: 'Ride Canceled by Rider',
    [RIDE_STATUSES.RIDE_STARTED]: 'Ride Started',
    [RIDE_STATUSES.RIDE_INTERRUPTED]: 'Ride Interrupted',
    [RIDE_STATUSES.RIDER_PICKED_UP]: 'Rider Picked Up',
    [RIDE_STATUSES.RIDER_NOT_PICKED_UP]: 'Rider Not Picked Up',
    [RIDE_STATUSES.RIDER_DROPPED_OFF]: 'Rider Dropped Off',
    [RIDE_STATUSES.RIDER_NOT_DROPPED_OFF]: 'Rider Not Dropped Off',
    [RIDE_STATUSES.ROUNDTRIP_RETURNING]: 'Roundtrip Returning',
    [RIDE_STATUSES.ROUNDTRIP_RETURN_INTERRUPTED]: 'Roundtrip Return Interrupted',
    [RIDE_STATUSES.ROUNDTRIP_COMPLETE]: 'Roundtrip Complete',
    [RIDE_STATUSES.ROUNDTRIP_COMPLETION_INTERRUPTED]: 'Roundtrip Completion Interrupted',
    [RIDE_STATUSES.RIDE_COMPLETE]: 'Ride Complete',
    [RIDE_STATUSES.RIDE_INCOMPLETE]: 'Ride Incomplete'
  };
  return descriptions[status] || 'Unknown Ride Status';
};

// Get next valid statuses (for status transitions)
const getNextValidStatuses = (currentStatus, isRoundTrip = false) => {
  const transitions = {
    [RIDE_STATUSES.REQUEST_IN_PROGRESS]: [RIDE_STATUSES.RIDE_CONFIRMED, RIDE_STATUSES.RIDE_CANCELED_BY_RIDER],
    [RIDE_STATUSES.RIDE_CONFIRMED]: [RIDE_STATUSES.RIDE_STARTED, RIDE_STATUSES.RIDE_CANCELED_BY_RIDER],
    [RIDE_STATUSES.RIDE_STARTED]: [RIDE_STATUSES.RIDER_PICKED_UP, RIDE_STATUSES.RIDE_INTERRUPTED],
    [RIDE_STATUSES.RIDER_PICKED_UP]: [RIDE_STATUSES.RIDER_DROPPED_OFF, RIDE_STATUSES.RIDE_INTERRUPTED],
    [RIDE_STATUSES.RIDER_DROPPED_OFF]: isRoundTrip 
      ? [RIDE_STATUSES.ROUNDTRIP_RETURNING, RIDE_STATUSES.RIDE_COMPLETE]
      : [RIDE_STATUSES.RIDE_COMPLETE],
    [RIDE_STATUSES.ROUNDTRIP_RETURNING]: [RIDE_STATUSES.ROUNDTRIP_COMPLETE, RIDE_STATUSES.ROUNDTRIP_RETURN_INTERRUPTED],
    [RIDE_STATUSES.RIDE_INTERRUPTED]: [RIDE_STATUSES.RIDE_INCOMPLETE],
    [RIDE_STATUSES.RIDER_NOT_PICKED_UP]: [RIDE_STATUSES.RIDE_INCOMPLETE],
    [RIDE_STATUSES.RIDER_NOT_DROPPED_OFF]: [RIDE_STATUSES.RIDE_INCOMPLETE],
    [RIDE_STATUSES.ROUNDTRIP_RETURN_INTERRUPTED]: [RIDE_STATUSES.ROUNDTRIP_COMPLETION_INTERRUPTED],
    [RIDE_STATUSES.ROUNDTRIP_COMPLETION_INTERRUPTED]: [RIDE_STATUSES.RIDE_INCOMPLETE]
  };
  
  return transitions[currentStatus] || [];
};

// Check if status transition is valid
const isValidStatusTransition = (fromStatus, toStatus, isRoundTrip = false) => {
  const validNextStatuses = getNextValidStatuses(fromStatus, isRoundTrip);
  return validNextStatuses.includes(toStatus);
};

module.exports = {
  RIDE_STATUSES,
  STATUS_CATEGORIES,
  CLOSING_STATUSES,
  PROBLEMATIC_STATUSES,
  isClosingStatus,
  isProblematicStatus,
  isValidStatus,
  getStatusDescription,
  getNextValidStatuses,
  isValidStatusTransition
}; 