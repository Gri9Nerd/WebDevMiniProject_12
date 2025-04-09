const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const users = [];
const medications = [];
const adherenceLogs = [];

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, 'your-secret-key-here', { expiresIn: '7d' });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };
    
    users.push(user);
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    const decoded = jwt.verify(token, 'your-secret-key-here');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Medication routes
app.get('/api/medications', authMiddleware, (req, res) => {
  const userMeds = medications.filter(med => med.userId === req.user.userId);
  res.json(userMeds);
});

app.post('/api/medications', authMiddleware, (req, res) => {
  try {
    const { name, dosage, schedule } = req.body;
    
    const medication = {
      id: medications.length + 1,
      userId: req.user.userId,
      name,
      dosage,
      schedule
    };
    
    medications.push(medication);
    res.status(201).json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/medications/:id', authMiddleware, (req, res) => {
  try {
    const index = medications.findIndex(
      med => med.id === parseInt(req.params.id) && med.userId === req.user.userId
    );
    
    if (index === -1) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    medications.splice(index, 1);
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Adherence routes
app.get('/api/medications/today', authMiddleware, (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const userMeds = medications.filter(med => med.userId === req.user.userId);
    
    const schedule = [];
    for (const med of userMeds) {
      for (const time of med.schedule) {
        const log = adherenceLogs.find(
          log => 
            log.userId === req.user.userId && 
            log.medicationId === med.id && 
            log.scheduledDate.getTime() === today.getTime() &&
            log.scheduledTime === time
        );
        
        schedule.push({
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: time,
          status: log ? log.status : 'upcoming',
          logId: log ? log.id : null
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

app.post('/api/medications/mark-taken', authMiddleware, (req, res) => {
  try {
    const { medicationId, scheduledTime } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let log = adherenceLogs.find(
      log => 
        log.userId === req.user.userId && 
        log.medicationId === medicationId && 
        log.scheduledDate.getTime() === today.getTime() &&
        log.scheduledTime === scheduledTime
    );
    
    if (!log) {
      log = {
        id: adherenceLogs.length + 1,
        userId: req.user.userId,
        medicationId,
        scheduledDate: today,
        scheduledTime,
        status: 'taken'
      };
      adherenceLogs.push(log);
    } else {
      log.status = 'taken';
    }
    
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 