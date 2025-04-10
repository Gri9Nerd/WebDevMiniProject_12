import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MedicationProvider } from './context/MedicationContext';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Create router options with future flags
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}
  >
    <CircularProgress />
  </Box>
);

const AppContent = () => {
  const { user, loading } = useAuth();
  const { theme } = useThemeContext();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router {...routerOptions}>
          {user && <Navbar />}
          <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <DashboardPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medications"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <MedicationsPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medications/new"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <MedicationsPage isNew={true} />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medications/:id"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <MedicationsPage isEdit={true} />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ProfilePage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <SettingsPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MedicationProvider>
            <AppContent />
          </MedicationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
