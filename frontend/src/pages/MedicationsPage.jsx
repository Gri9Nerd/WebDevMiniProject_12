import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMedications } from '../context/MedicationContext';
import MedicationCard from '../components/MedicationCard';
import MedicationForm from '../components/MedicationForm';

const MedicationsPage = ({ isNew, isEdit }) => {
  const { medications, loading, error, addMedication, updateMedication } = useMedications();
  const [searchTerm, setSearchTerm] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const currentMedication = isEdit ? medications.find(med => med._id === id) : null;

  useEffect(() => {
    if (isEdit && !currentMedication && !loading) {
      navigate('/medications');
    }
  }, [isEdit, currentMedication, loading, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitError(null);
    try {
      if (isNew) {
        await addMedication(formData);
      } else if (isEdit) {
        await updateMedication(id, formData);
      }
      navigate('/medications');
    } catch (err) {
      console.error('Failed to save medication:', err);
      setSubmitError(err.message || 'Failed to save medication. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (isNew || isEdit) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <MedicationForm
          medication={currentMedication}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/medications')}
        />
      </Container>
    );
  }

  const filteredMedications = medications.filter(medication =>
    medication?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Medications
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your medications and track your doses
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/medications/new')}
        >
          Add New Medication
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search medications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      {filteredMedications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No medications found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {searchTerm ? 'Try adjusting your search' : 'Add your first medication to get started'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/medications/new')}
            >
              Add Medication
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredMedications.map((medication) => (
            <Grid item xs={12} sm={6} md={4} key={medication._id}>
              <MedicationCard medication={medication} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MedicationsPage; 