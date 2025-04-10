const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    trim: true
  },
  schedule: {
    type: [String],
    required: true,
    default: ['08:00', '20:00']
  },
  notes: {
    type: String,
    trim: true
  },
  reminders: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication; 