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
  CircularProgress,
  Chip,
  Paper,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import { medications } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MedicationsPage() {
  const [medicationList, setMedicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    schedule: ['08:00', '20:00'],
    notes: '',
    reminders: true
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchMedications();
  }, [user, navigate]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await medications.getAll();
      setMedicationList(response.data);
    } catch (err) {
      setError('Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    try {
      setLoading(true);
      if (editMode) {
        await medications.update(selectedMedication._id, newMedication);
        setSuccessMessage('Medication updated successfully');
      } else {
        await medications.add(newMedication);
        setSuccessMessage('Medication added successfully');
      }
      setOpenDialog(false);
      setNewMedication({ name: '', dosage: '', schedule: ['08:00', '20:00'], notes: '', reminders: true });
      setEditMode(false);
      setSelectedMedication(null);
      fetchMedications();
    } catch (err) {
      console.error('Error adding/updating medication:', err);
      setError(`Failed to ${editMode ? 'update' : 'add'} medication: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (id) => {
    try {
      setLoading(true);
      await medications.delete(id);
      setSuccessMessage('Medication deleted successfully');
      fetchMedications();
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError(`Failed to delete medication: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    setNewMedication({
      name: medication.name,
      dosage: medication.dosage || '',
      schedule: medication.schedule,
      notes: medication.notes || '',
      reminders: medication.reminders !== false
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleMenuOpen = (event, medication) => {
    setAnchorEl(event.currentTarget);
    setSelectedMedication(medication);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMedication(null);
  };

  const handleOpenDialog = (medication = null) => {
    if (medication) {
      setSelectedMedication(medication);
      setNewMedication({
        name: medication.name,
        dosage: medication.dosage,
        schedule: medication.schedule,
        notes: medication.notes || '',
        reminders: medication.reminders !== false
      });
    } else {
      setSelectedMedication(null);
      setNewMedication({
        name: '',
        dosage: '',
        schedule: ['08:00', '20:00'],
        notes: '',
        reminders: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMedication(null);
    setNewMedication({
      name: '',
      dosage: '',
      schedule: ['08:00', '20:00'],
      notes: '',
      reminders: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Medications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Medication
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {medicationList.map((med) => (
          <Grid item xs={12} md={6} key={med._id || med.id}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {med.name}
                  </Typography>
                  <IconButton onClick={(e) => handleMenuOpen(e, med)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    {med.dosage && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography color="text.secondary">
                          {med.dosage}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography color="text.secondary">
                        {med.schedule.join(', ')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        icon={<NotificationsIcon />}
                        label={med.reminders ? "Reminders On" : "Reminders Off"}
                        color={med.reminders ? "success" : "default"}
                        size="small"
                      />
                      <Chip
                        icon={<HistoryIcon />}
                        label={`${med.adherenceRate || 0}% Adherence`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {med.notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {med.notes}
                    </Typography>
                  </>
                )}
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate(`/medications/${med._id || med.id}/history`)}
                >
                  View History
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          handleEditMedication(selectedMedication);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleDeleteMedication(selectedMedication._id);
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit Medication' : 'Add New Medication'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Medication Name"
              fullWidth
              value={newMedication.name}
              onChange={handleInputChange}
              name="name"
            />
            <TextField
              label="Dosage (optional)"
              fullWidth
              value={newMedication.dosage}
              onChange={handleInputChange}
              name="dosage"
            />
            <TextField
              label="Schedule (comma-separated times, e.g., 08:00, 20:00)"
              fullWidth
              value={newMedication.schedule.join(', ')}
              onChange={(e) => setNewMedication({ 
                ...newMedication, 
                schedule: e.target.value.split(',').map(time => time.trim()) 
              })}
              helperText="Enter times in 24-hour format (HH:MM)"
              name="schedule"
            />
            <TextField
              label="Notes (optional)"
              fullWidth
              multiline
              rows={3}
              value={newMedication.notes}
              onChange={handleInputChange}
              name="notes"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMedication} 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {editMode ? 'Save Changes' : 'Add Medication'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
} 