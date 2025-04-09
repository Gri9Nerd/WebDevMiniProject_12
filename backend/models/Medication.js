const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  schedule: [{
    type: String,
    required: true,
    // Format: "HH:mm"
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Medication', medicationSchema); 