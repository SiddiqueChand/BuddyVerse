// models/registration.js
const mongoose = require('mongoose');

// Enhanced schema with validation and security
const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  event: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  buddy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buddy',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for faster queries
registrationSchema.index({ event: 1 }); // Index on event field

// Create model
const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;