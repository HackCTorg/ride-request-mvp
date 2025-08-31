const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        index: "text"
    },
    fullname: {
        type: String,
        required: true,
        index: "text"
    },
    phone: {
        type: String,
        required: true,
        index: "text"
    },
    dob: {
        type: String,
        required: true,
    },
    race: {
        type: String,
        required: true,
        enum: ['black', 'white', 'asian', 'latino', 'native american', 'other', 'prefer not to say']
    },
    maritalStatus: {
        type: String,
        required: true,
        enum: ['single', 'married', 'divorced', 'widowed', 'separated', 'other', 'prefer not to say']
    },
    residence: {
        current: {
            type: String,
            required: false
        },
        last: {
            type: String,
            required: true
        }
    },
    income: {
        current: {
            type: String,
            required: false
        },
        last: {
            type: String,
            required: true
        }
    },
    serviceUserRole: {
        type: [String],
        required: true,
        enum: ['rider', 'caregiver', 'relative', 'guardian', 'case manager', 'other']
    },
    veteranStatus: {
        type: String,
        required: false,
        enum: ['veteran', 'not veteran', 'prefer not to say']
    },
    disabilityStatus: {
        type: String,
        required: false,
        enum: ['yes', 'no', 'prefer not to say']
    },
}, {
  timestamps: true
});

userSchema.index({ uuid: 1 });

module.exports = mongoose.model('User', userSchema); 