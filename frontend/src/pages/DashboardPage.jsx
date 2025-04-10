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
  Alert,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { medications } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalMedications: 0,
    takenToday: 0,
    upcomingToday: 0,
    adherenceRate: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [scheduleResponse, statsResponse] = await Promise.all([
          medications.getTodaySchedule(),
          medications.getStats()
        ]);
        setSchedule(scheduleResponse.data);
        setStats(statsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleMarkTaken = async (medicationId, scheduledTime) => {
    try {
      await medications.markTaken(medicationId, scheduledTime);
      // Update the local state
      setSchedule(prevSchedule => 
        prevSchedule.map(item => 
          item.medicationId === medicationId && item.scheduledTime === scheduledTime
            ? { ...item, status: 'taken' }
            : item
        )
      );
      // Update stats
      setStats(prev => ({
        ...prev,
        takenToday: prev.takenToday + 1,
        upcomingToday: prev.upcomingToday - 1
      }));
    } catch (err) {
      console.error('Error marking medication as taken:', err);
      setError('Failed to mark medication as taken');
    }
  };

  const handleAddMedication = () => {
    navigate('/medications/new');
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Medications
            </Typography>
            <Typography variant="h3" component="div">
              {stats.totalMedications || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.success.main,
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Taken Today
            </Typography>
            <Typography variant="h3" component="div">
              {stats.takenToday || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.warning.main,
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upcoming Today
            </Typography>
            <Typography variant="h3" component="div">
              {stats.upcomingToday || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.info.main,
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Adherence Rate
            </Typography>
            <Typography variant="h3" component="div">
              {(stats.adherenceRate || 0).toFixed(0)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Today's Schedule Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Today's Schedule
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddMedication}
            sx={{ borderRadius: 2 }}
          >
            Add Medication
          </Button>
        </Box>

        {schedule.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No medications scheduled for today. Add medications in the Medications page.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {schedule.map((item) => (
              <Grid item xs={12} key={`${item.medicationId}-${item.scheduledTime}`}>
                <Card sx={{ 
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="div">
                          {item.medicationName}
                        </Typography>
                        <Chip
                          label={item.status === 'taken' ? 'Taken' : 'Upcoming'}
                          color={item.status === 'taken' ? 'success' : 'default'}
                          icon={item.status === 'taken' ? <CheckCircleIcon /> : <AccessTimeIcon />}
                          size="small"
                        />
                      </Box>
                      <Tooltip title="Set Reminder">
                        <IconButton color="primary">
                          <NotificationsIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        {item.dosage && (
                          <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon fontSize="small" />
                            Dosage: {item.dosage}
                          </Typography>
                        )}
                        <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <AccessTimeIcon fontSize="small" />
                          Scheduled for: {item.scheduledTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mt: { xs: 2, md: 0 } }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Adherence History
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={item.adherenceRate || 0} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            {item.adherenceRate || 0}% adherence rate
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ p: 2 }}>
                    {item.status !== 'taken' && (
                      <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => handleMarkTaken(item.medicationId, item.scheduledTime)}
                        sx={{ borderRadius: 2 }}
                      >
                        Mark as Taken
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate(`/medications/${item.medicationId}`)}
                      sx={{ borderRadius: 2, ml: 1 }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
} 