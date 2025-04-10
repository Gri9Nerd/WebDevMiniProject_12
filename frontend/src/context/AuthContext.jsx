import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const register = async (email, password) => {
    try {
      console.log('Attempting to register with:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      showToast('Registration successful!', 'success');
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      showToast(error.message, 'error');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting to login with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showToast('Login successful!', 'success');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      showToast(error.message, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast(error.message, 'error');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, showToast }}>
      {children}
      {toast && <Toast {...toast} />}
    </AuthContext.Provider>
  );
}; 