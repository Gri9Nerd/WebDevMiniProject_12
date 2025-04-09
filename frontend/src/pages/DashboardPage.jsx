import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { medications } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSchedule = async () => {
      try {
        const response = await medications.getTodaySchedule();
        setSchedule(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load medication schedule');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user, navigate]);

  const handleMarkTaken = async (medicationId, scheduledTime) => {
    try {
      await medications.markTaken({ medicationId, scheduledTime });
      // Update the local state
      setSchedule(prevSchedule => 
        prevSchedule.map(item => 
          item.medicationId === medicationId && item.scheduledTime === scheduledTime
            ? { ...item, status: 'taken' }
            : item
        )
      );
    } catch (err) {
      setError('Failed to mark medication as taken');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Today's Medications
      </Typography>

      {schedule.length === 0 ? (
        <Alert severity="info">
          No medications scheduled for today. Add medications in the Medications page.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {schedule.map((item) => (
            <Grid item xs={12} key={`${item.medicationId}-${item.scheduledTime}`}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                      {item.medicationName}
                    </Typography>
                    <Chip
                      label={item.status === 'taken' ? 'Taken' : 'Upcoming'}
                      color={item.status === 'taken' ? 'success' : 'default'}
                      icon={item.status === 'taken' ? <CheckCircleIcon /> : null}
                    />
                  </Box>
                  {item.dosage && (
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Dosage: {item.dosage}
                    </Typography>
                  )}
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Scheduled for: {item.scheduledTime}
                  </Typography>
                </CardContent>
                <CardActions>
                  {item.status !== 'taken' && (
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleMarkTaken(item.medicationId, item.scheduledTime)}
                    >
                      Mark as Taken
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 