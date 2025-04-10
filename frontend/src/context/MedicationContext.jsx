import { createContext, useContext, useState, useEffect } from 'react';
import { medications } from '../services/api';

const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [medicationsList, setMedicationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await medications.getAll();
      setMedicationsList(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError('Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = async (medication) => {
    try {
      const response = await medications.add(medication);
      setMedicationsList(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding medication:', err);
      throw err;
    }
  };

  const updateMedication = async (id, medication) => {
    try {
      const response = await medications.update(id, medication);
      setMedicationsList(prev => 
        prev.map(m => m._id === id ? response.data : m)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating medication:', err);
      throw err;
    }
  };

  const deleteMedication = async (id) => {
    try {
      await medications.delete(id);
      setMedicationsList(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Error deleting medication:', err);
      throw err;
    }
  };

  const markMedicationAsTaken = async (id, scheduledTime) => {
    try {
      const response = await medications.markTaken(id, scheduledTime);
      setMedicationsList(prev => 
        prev.map(m => m._id === id ? response.data : m)
      );
      return response.data;
    } catch (err) {
      console.error('Error marking medication as taken:', err);
      throw err;
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications: medicationsList,
        loading,
        error,
        addMedication,
        updateMedication,
        deleteMedication,
        markMedicationAsTaken,
        fetchMedications
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
}; 