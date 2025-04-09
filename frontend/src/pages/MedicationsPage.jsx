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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { medications } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MedicationsPage() {
  const [medicationList, setMedicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    schedule: ['08:00', '20:00'] // Default schedule
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchMedications();
  }, [user, navigate]);

  const fetchMedications = async () => {
    try {
      const response = await medications.getAll();
      setMedicationList(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load medications');
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    try {
      await medications.add(newMedication);
      setOpenDialog(false);
      setNewMedication({ name: '', dosage: '', schedule: ['08:00', '20:00'] });
      fetchMedications();
    } catch (err) {
      setError('Failed to add medication');
    }
  };

  const handleDeleteMedication = async (id) => {
    try {
      await medications.delete(id);
      fetchMedications();
    } catch (err) {
      setError('Failed to delete medication');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Medications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Medication
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {medicationList.map((med) => (
          <Grid item xs={12} key={med._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {med.name}
                </Typography>
                {med.dosage && (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Dosage: {med.dosage}
                  </Typography>
                )}
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Schedule: {med.schedule.join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  color="error" 
                  onClick={() => handleDeleteMedication(med._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Medication</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Medication Name"
            fullWidth
            value={newMedication.name}
            onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Dosage (optional)"
            fullWidth
            value={newMedication.dosage}
            onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Schedule (comma-separated times, e.g., 08:00, 20:00)"
            fullWidth
            value={newMedication.schedule.join(', ')}
            onChange={(e) => setNewMedication({ 
              ...newMedication, 
              schedule: e.target.value.split(',').map(time => time.trim()) 
            })}
            helperText="Enter times in 24-hour format (HH:MM)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMedication} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 