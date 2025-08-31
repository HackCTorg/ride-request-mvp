const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  uuid: {
    type: Number,
    required: true,
    unique: true,
    index: "text"
  },
  fullName: {
    type: String,
    required: true,
    index: "text"
  },
  title: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true,
    enum: ['EASTCONN', 'Generations Health', 'other']
  },
  phone: {
    type: String,
    required: true,
    index: "text"
  },
  role: {
    type: String,
    required: true,
    enum: ['Transport Broker', 'Staff', 'Fleet Manager', 'Driver', 'Admin']
  },
  specializations: {
    type: String,
    enum: ['Caseworker', 'Nutritionist', 'Intake'],
    validate: {
      validator: function(specializations) {
        // Only allow specializations if role is 'Staff'
        if (this.role !== 'Staff' && specializations) {
          return false;
        }
        return true;
      },
      message: 'Specializations can only be set when role is Staff'
    }
  },
  faxPhone: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
serviceProviderSchema.index({ uuid: 1 });

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema); 