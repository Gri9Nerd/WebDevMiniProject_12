import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Stack
} from '@mui/material';

const MedicationForm = ({ medication, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: medication?.name || '',
    dosage: medication?.dosage || '',
    schedule: medication?.schedule || ['08:00', '20:00'],
    notes: medication?.notes || '',
    reminders: medication?.reminders ?? true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleScheduleChange = (e) => {
    const times = e.target.value.split(',').map(time => time.trim());
    const validTimes = times.filter(time => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time));
    setFormData(prev => ({
      ...prev,
      schedule: validTimes.length > 0 ? validTimes : prev.schedule
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {medication ? 'Edit Medication' : 'Add New Medication'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Medication Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            helperText="Optional"
          />

          <TextField
            fullWidth
            label="Schedule"
            value={formData.schedule.join(', ')}
            onChange={handleScheduleChange}
            helperText="Enter times in 24-hour format (HH:MM), separated by commas. Example: 08:00, 20:00"
            error={formData.schedule.length === 0}
          />

          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            helperText="Optional"
          />

          <FormControlLabel
            control={
              <Checkbox
                name="reminders"
                checked={formData.reminders}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Enable Reminders"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {medication ? 'Save Changes' : 'Add Medication'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default MedicationForm; 