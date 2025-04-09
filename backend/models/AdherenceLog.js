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
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'upcoming'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
adherenceLogSchema.index({ userId: 1, medicationId: 1, scheduledDate: 1, scheduledTime: 1 }, { unique: true });

const AdherenceLog = mongoose.model('AdherenceLog', adherenceLogSchema);

module.exports = AdherenceLog; 