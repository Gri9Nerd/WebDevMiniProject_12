import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider
} from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: 15, // minutes before scheduled time
    darkMode: false
  });
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [saved, setSaved] = useState(false);

  const handleChange = (name) => (event) => {
    setSettings(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // TODO: Implement settings save functionality
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={handleChange('emailNotifications')}
                color="primary"
              />
            }
            label="Email Notifications"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Receive medication reminders via email
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.pushNotifications}
                onChange={handleChange('pushNotifications')}
                color="primary"
              />
            }
            label="Push Notifications"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Receive medication reminders as push notifications
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                color="primary"
              />
            }
            label="Dark Mode"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Use dark theme throughout the app
          </Typography>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Settings saved successfully
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage; 