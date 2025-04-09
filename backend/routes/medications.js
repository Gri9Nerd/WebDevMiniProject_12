const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Medication = require('../models/Medication');
const AdherenceLog = require('../models/AdherenceLog');

// Get all medications for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user.userId });
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new medication
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, dosage, schedule } = req.body;

    const medication = new Medication({
      userId: req.user.userId,
      name,
      dosage,
      schedule
    });

    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete medication
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Also delete associated adherence logs
    await AdherenceLog.deleteMany({ medicationId: req.params.id });

    res.json({ message: 'Medication deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's adherence schedule
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's medications
    const medications = await Medication.find({ userId: req.user.userId });

    // For each medication and schedule time, check adherence status
    const schedule = [];
    for (const med of medications) {
      for (const time of med.schedule) {
        // Check if adherence log exists
        const log = await AdherenceLog.findOne({
          userId: req.user.userId,
          medicationId: med._id,
          scheduledDate: today,
          scheduledTime: time
        });

        schedule.push({
          medicationId: med._id,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: time,
          status: log ? log.status : 'upcoming',
          logId: log ? log._id : null
        });
      }
    }

    // Sort by scheduled time
    schedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark medication as taken
router.post('/mark-taken', authMiddleware, async (req, res) => {
  try {
    const { medicationId, scheduledTime } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create adherence log
    let log = await AdherenceLog.findOne({
      userId: req.user.userId,
      medicationId,
      scheduledDate: today,
      scheduledTime
    });

    if (!log) {
      log = new AdherenceLog({
        userId: req.user.userId,
        medicationId,
        scheduledDate: today,
        scheduledTime,
        status: 'taken'
      });
    } else {
      log.status = 'taken';
    }

    await log.save();
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 