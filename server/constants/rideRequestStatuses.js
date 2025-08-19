// Ride Request Status Constants
// This file defines the statuses for ride requests throughout their lifecycle
// Each status has a code, description, and ordinal for workflow ordering

const RIDE_REQUEST_STATUSES = {
  // 100s - All Ride Request Operations
  ALL_RIDE_REQUEST_OPEN: {
    code: 100,
    description: 'All Ride Request Open',
    ordinal: 1,
    category: 'REQUEST_OPEN'
  },
  ALL_RIDE_REQUEST_CANCELED: {
    code: 109,
    description: 'All Ride Request Canceled',
    ordinal: 2,
    category: 'REQUEST_CANCELED'
  },

  // 200s - Driver Operations
  DRIVER_NEEDED: {
    code: 200,
    description: 'Driver Needed',
    ordinal: 3,
    category: 'DRIVER_OPERATIONS'
  },
  DRIVER_UNAVAILABLE: {
    code: 209,
    description: 'Driver Unavailable',
    ordinal: 4,
    category: 'DRIVER_OPERATIONS'
  },

  // 300s - Vehicle Operations
  VEHICLE_NEEDED: {
    code: 300,
    description: 'Vehicle Needed',
    ordinal: 5,
    category: 'VEHICLE_OPERATIONS'
  },
  VEHICLE_UNAVAILABLE: {
    code: 309,
    description: 'Vehicle Unavailable',
    ordinal: 6,
    category: 'VEHICLE_OPERATIONS'
  },

  // 400s - Ride Confirmation Operations
  RIDE_CONFIRMATION_NEEDED: {
    code: 400,
    description: 'Ride Confirmation Needed',
    ordinal: 7,
    category: 'CONFIRMATION_OPERATIONS'
  },
  RIDE_CANCELED_UNCONFIRMED: {
    code: 409,
    description: 'Ride Canceled, Unconfirmed',
    ordinal: 8,
    category: 'CONFIRMATION_OPERATIONS'
  },

  // 500s - ECTC Transport Broker Operations
  ECTC_TRANSPORT_BROKER_NOTIFIED: {
    code: 500,
    description: 'ECTC Transport Broker Notified',
    ordinal: 9,
    category: 'BROKER_OPERATIONS'
  },
  ECTC_TRANSPORT_BROKER_APPROVED: {
    code: 525,
    description: 'ECTC Transport Broker Approved',
    ordinal: 10,
    category: 'BROKER_OPERATIONS'
  },
  ECTC_TRANSPORT_BROKER_DENIED: {
    code: 599,
    description: 'ECTC Transport Broker Denied',
    ordinal: 11,
    category: 'BROKER_OPERATIONS'
  },

  // 600s - ECTC Fleet Manager Operations
  ECTC_FLEET_MANAGER_NOTIFIED: {
    code: 600,
    description: 'ECTC Fleet Manager Notified',
    ordinal: 12,
    category: 'FLEET_OPERATIONS'
  },
  ECTC_FLEET_MANAGER_APPROVED: {
    code: 625,
    description: 'ECTC Fleet Manager Approved',
    ordinal: 13,
    category: 'FLEET_OPERATIONS'
  },
  ECTC_FLEET_MANAGER_DENIED: {
    code: 699,
    description: 'ECTC Fleet Manager Denied',
    ordinal: 14,
    category: 'FLEET_OPERATIONS'
  },

  // 700s - ECTC Staff Operations
  ECTC_STAFF_NOTIFIED: {
    code: 700,
    description: 'ECTC Staff Notified',
    ordinal: 15,
    category: 'STAFF_OPERATIONS'
  },
  ECTC_STAFF_APPROVED: {
    code: 725,
    description: 'ECTC Staff Approved',
    ordinal: 16,
    category: 'STAFF_OPERATIONS'
  },
  ECTC_STAFF_DENIED: {
    code: 799,
    description: 'ECTC Staff Denied',
    ordinal: 17,
    category: 'STAFF_OPERATIONS'
  },

  // 1000s - Final States
  ALL_RIDE_REQUEST_READY_TO_RIDE: {
    code: 1000,
    description: 'All Ride Request Ready to Ride',
    ordinal: 18,
    category: 'READY_TO_RIDE'
  },
  ALL_RIDE_REQUEST_CLOSED: {
    code: 1100,
    description: 'All Ride Request Closed',
    ordinal: 19,
    category: 'REQUEST_CLOSED'
  }
};

// Status categories for easier management
const STATUS_CATEGORIES = {
  REQUEST_OPEN: [RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_OPEN],
  REQUEST_CANCELED: [RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CANCELED],
  DRIVER_OPERATIONS: [
    RIDE_REQUEST_STATUSES.DRIVER_NEEDED,
    RIDE_REQUEST_STATUSES.DRIVER_UNAVAILABLE
  ],
  VEHICLE_OPERATIONS: [
    RIDE_REQUEST_STATUSES.VEHICLE_NEEDED,
    RIDE_REQUEST_STATUSES.VEHICLE_UNAVAILABLE
  ],
  CONFIRMATION_OPERATIONS: [
    RIDE_REQUEST_STATUSES.RIDE_CONFIRMATION_NEEDED,
    RIDE_REQUEST_STATUSES.RIDE_CANCELED_UNCONFIRMED
  ],
  BROKER_OPERATIONS: [
    RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_NOTIFIED,
    RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_APPROVED,
    RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_DENIED
  ],
  FLEET_OPERATIONS: [
    RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_NOTIFIED,
    RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_APPROVED,
    RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_DENIED
  ],
  STAFF_OPERATIONS: [
    RIDE_REQUEST_STATUSES.ECTC_STAFF_NOTIFIED,
    RIDE_REQUEST_STATUSES.ECTC_STAFF_APPROVED,
    RIDE_REQUEST_STATUSES.ECTC_STAFF_DENIED
  ],
  READY_TO_RIDE: [RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_READY_TO_RIDE],
  REQUEST_CLOSED: [RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CLOSED]
};

// Statuses that indicate the ride request should be closed
const CLOSING_STATUSES = [
  RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CANCELED,
  RIDE_REQUEST_STATUSES.DRIVER_UNAVAILABLE,
  RIDE_REQUEST_STATUSES.VEHICLE_UNAVAILABLE,
  RIDE_REQUEST_STATUSES.RIDE_CANCELED_UNCONFIRMED,
  RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_DENIED,
  RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_DENIED,
  RIDE_REQUEST_STATUSES.ECTC_STAFF_DENIED,
  RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CLOSED
];

// Statuses that indicate a bad condition or denial
const PROBLEMATIC_STATUSES = [
  RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CANCELED,
  RIDE_REQUEST_STATUSES.DRIVER_UNAVAILABLE,
  RIDE_REQUEST_STATUSES.VEHICLE_UNAVAILABLE,
  RIDE_REQUEST_STATUSES.RIDE_CANCELED_UNCONFIRMED,
  RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_DENIED,
  RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_DENIED,
  RIDE_REQUEST_STATUSES.ECTC_STAFF_DENIED
];

// Helper functions
const isClosingStatus = (status) => CLOSING_STATUSES.some(s => s.code === status);
const isProblematicStatus = (status) => PROBLEMATIC_STATUSES.some(s => s.code === status);
const isValidStatus = (status) => Object.values(RIDE_REQUEST_STATUSES).some(s => s.code === status);

// Get status object by code
const getStatusByCode = (code) => {
  return Object.values(RIDE_REQUEST_STATUSES).find(status => status.code === code);
};

// Get status description by code
const getStatusDescription = (code) => {
  const status = getStatusByCode(code);
  return status ? status.description : 'Unknown Status';
};

// Get status ordinal by code
const getStatusOrdinal = (code) => {
  const status = getStatusByCode(code);
  return status ? status.ordinal : 0;
};

// Get status category by code
const getStatusCategory = (code) => {
  const status = getStatusByCode(code);
  return status ? status.category : 'UNKNOWN';
};

// Get all statuses ordered by ordinal
const getStatusesByOrdinal = () => {
  return Object.values(RIDE_REQUEST_STATUSES).sort((a, b) => a.ordinal - b.ordinal);
};

// Get next valid statuses (for status transitions) based on workflow
const getNextValidStatuses = (currentStatusCode) => {
  const currentStatus = getStatusByCode(currentStatusCode);
  if (!currentStatus) return [];

  // Define workflow transitions based on business logic
  const transitions = {
    [RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_OPEN.code]: [
      RIDE_REQUEST_STATUSES.DRIVER_NEEDED.code,
      RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CANCELED.code
    ],
    [RIDE_REQUEST_STATUSES.DRIVER_NEEDED.code]: [
      RIDE_REQUEST_STATUSES.DRIVER_UNAVAILABLE.code,
      RIDE_REQUEST_STATUSES.VEHICLE_NEEDED.code
    ],
    [RIDE_REQUEST_STATUSES.VEHICLE_NEEDED.code]: [
      RIDE_REQUEST_STATUSES.VEHICLE_UNAVAILABLE.code,
      RIDE_REQUEST_STATUSES.RIDE_CONFIRMATION_NEEDED.code
    ],
    [RIDE_REQUEST_STATUSES.RIDE_CONFIRMATION_NEEDED.code]: [
      RIDE_REQUEST_STATUSES.RIDE_CANCELED_UNCONFIRMED.code,
      RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_NOTIFIED.code
    ],
    [RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_NOTIFIED.code]: [
      RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_APPROVED.code,
      RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_DENIED.code
    ],
    [RIDE_REQUEST_STATUSES.ECTC_TRANSPORT_BROKER_APPROVED.code]: [
      RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_NOTIFIED.code
    ],
    [RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_NOTIFIED.code]: [
      RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_APPROVED.code,
      RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_DENIED.code
    ],
    [RIDE_REQUEST_STATUSES.ECTC_FLEET_MANAGER_APPROVED.code]: [
      RIDE_REQUEST_STATUSES.ECTC_STAFF_NOTIFIED.code
    ],
    [RIDE_REQUEST_STATUSES.ECTC_STAFF_NOTIFIED.code]: [
      RIDE_REQUEST_STATUSES.ECTC_STAFF_APPROVED.code,
      RIDE_REQUEST_STATUSES.ECTC_STAFF_DENIED.code
    ],
    [RIDE_REQUEST_STATUSES.ECTC_STAFF_APPROVED.code]: [
      RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_READY_TO_RIDE.code
    ],
    [RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_READY_TO_RIDE.code]: [
      RIDE_REQUEST_STATUSES.ALL_RIDE_REQUEST_CLOSED.code
    ]
  };

  return transitions[currentStatus.code] || [];
};

// Check if status transition is valid
const isValidStatusTransition = (fromStatusCode, toStatusCode) => {
  const validNextStatuses = getNextValidStatuses(fromStatusCode);
  return validNextStatuses.includes(toStatusCode);
};

// Get all status codes as a simple array
const getAllStatusCodes = () => {
  return Object.values(RIDE_REQUEST_STATUSES).map(status => status.code);
};

// Get all status descriptions as a mapping
const getAllStatusDescriptions = () => {
  const descriptions = {};
  Object.values(RIDE_REQUEST_STATUSES).forEach(status => {
    descriptions[status.code] = status.description;
  });
  return descriptions;
};

module.exports = {
  RIDE_REQUEST_STATUSES,
  STATUS_CATEGORIES,
  CLOSING_STATUSES,
  PROBLEMATIC_STATUSES,
  isClosingStatus,
  isProblematicStatus,
  isValidStatus,
  getStatusByCode,
  getStatusDescription,
  getStatusOrdinal,
  getStatusCategory,
  getStatusesByOrdinal,
  getNextValidStatuses,
  isValidStatusTransition,
  getAllStatusCodes,
  getAllStatusDescriptions
}; 