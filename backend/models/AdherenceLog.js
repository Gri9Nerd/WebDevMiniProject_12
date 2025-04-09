const mongoose = require('mongoose');

const adherenceLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  scheduledTime: {
    type: String,
    required: true,
    // Format: "HH:mm"
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['taken', 'upcoming'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
adherenceLogSchema.index({ userId: 1, medicationId: 1, scheduledDate: 1, scheduledTime: 1 }, { unique: true });

module.exports = mongoose.model('AdherenceLog', adherenceLogSchema); 