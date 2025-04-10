import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useMedications } from '../context/MedicationContext';

const MedicationCard = ({ medication }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { deleteMedication, markMedicationAsTaken } = useMedications();

  // Calculate next dose and last taken times
  const { nextDose, lastTaken } = useMemo(() => {
    if (!medication?.schedule || medication.schedule.length === 0) {
      return { nextDose: null, lastTaken: null };
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    // Convert schedule times to minutes for comparison
    const scheduleTimes = medication.schedule.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    });

    // Find next dose
    const nextDoseMinutes = scheduleTimes.find(time => time > currentTime) || scheduleTimes[0];
    const nextDoseDate = new Date();
    if (nextDoseMinutes <= currentTime) {
      nextDoseDate.setDate(nextDoseDate.getDate() + 1); // Tomorrow
    }
    nextDoseDate.setHours(Math.floor(nextDoseMinutes / 60));
    nextDoseDate.setMinutes(nextDoseMinutes % 60);

    // Find last taken
    const lastTakenTime = medication.lastTaken ? new Date(medication.lastTaken) : null;

    return {
      nextDose: nextDoseDate,
      lastTaken: lastTakenTime
    };
  }, [medication]);

  if (!medication) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Error: Medication data is missing</Alert>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async () => {
    if (!medication || !medication._id) {
      setError('Invalid medication ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this medication?')) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await deleteMedication(medication._id);
    } catch (err) {
      setError(err.message || 'Failed to delete medication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkTaken = async () => {
    if (!medication || !medication._id) {
      setError('Invalid medication ID');
      return;
    }

    if (!medication.schedule || medication.schedule.length === 0) {
      setError('No schedule found for this medication');
      return;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Convert schedule times to minutes and find the closest time
    const closestTime = medication.schedule.reduce((closest, time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const currentDiff = Math.abs(currentMinutes - timeInMinutes);
      const closestDiff = closest ? Math.abs(currentMinutes - (closest.hours * 60 + closest.minutes)) : Infinity;
      
      return currentDiff < closestDiff ? { time, hours, minutes } : closest;
    }, null);

    if (!closestTime) {
      setError('No scheduled time found for this medication');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await markMedicationAsTaken(medication._id, closestTime.time);
    } catch (err) {
      setError(err.message || 'Failed to mark medication as taken');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'Not available';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });

    if (isToday) return `Today, ${timeString}`;
    if (isTomorrow) return `Tomorrow, ${timeString}`;
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {medication.name}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={() => navigate(`/medications/${medication._id}`)}
              aria-label="Edit medication"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              aria-label="Delete medication"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          {medication.dosage && (
            <Chip
              label={medication.dosage}
              color="secondary"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          <Chip
            label={`${medication.schedule.length} time${medication.schedule.length !== 1 ? 's' : ''} per day`}
            color="primary"
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Next Dose
            </Typography>
            <Typography variant="body2">
              {formatDateTime(nextDose)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Last Taken
            </Typography>
            <Typography variant="body2">
              {formatDateTime(lastTaken)}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleMarkTaken}
          disabled={isLoading}
          startIcon={<CheckCircleIcon />}
        >
          Mark as Taken
        </Button>
      </CardActions>
    </Card>
  );
};

export default MedicationCard; 