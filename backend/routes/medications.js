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

// Add a new medication
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, dosage, schedule, notes, reminders } = req.body;
    
    const medication = new Medication({
      userId: req.user.userId,
      name,
      dosage,
      schedule,
      notes,
      reminders
    });
    
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a medication
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, dosage, schedule, notes, reminders } = req.body;
    
    const medication = await Medication.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    medication.name = name;
    medication.dosage = dosage;
    medication.schedule = schedule;
    medication.notes = notes;
    medication.reminders = reminders;
    
    await medication.save();
    res.json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a medication
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

// Get today's schedule
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const medications = await Medication.find({ userId: req.user.userId });
    const schedule = [];
    
    for (const med of medications) {
      for (const time of med.schedule) {
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
      await log.save();
    } else {
      log.status = 'taken';
      await log.save();
    }
    
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get medication stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user.userId });
    const totalMedications = medications.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = await AdherenceLog.find({
      userId: req.user.userId,
      scheduledDate: today
    });
    
    const takenToday = todayLogs.filter(log => log.status === 'taken').length;
    const upcomingToday = todayLogs.filter(log => log.status === 'upcoming').length;
    
    // Calculate adherence rate (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const logs = await AdherenceLog.find({
      userId: req.user.userId,
      scheduledDate: { $gte: sevenDaysAgo }
    });
    
    const totalScheduled = logs.length;
    const totalTaken = logs.filter(log => log.status === 'taken').length;
    const adherenceRate = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;
    
    res.json({
      totalMedications,
      takenToday,
      upcomingToday,
      adherenceRate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 