import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MedicationList = ({ medications, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const handleMenuOpen = (event, medication) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMedication(medication);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMedication(null);
  };

  const handleEdit = () => {
    onEdit(selectedMedication);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(selectedMedication._id);
    handleMenuClose();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {medications.map((med) => (
        <div
          key={med._id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{med.name}</h3>
            <button
              onClick={(e) => handleMenuOpen(e, med)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              {med.dosage && (
                <div className="flex items-center text-gray-600 mb-2">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  {med.dosage}
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {med.schedule.join(', ')}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  med.reminders
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {med.reminders ? 'Reminders On' : 'Reminders Off'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {med.adherenceRate || 0}% Adherence
              </span>
            </div>
          </div>

          {med.notes && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600">{med.notes}</p>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => navigate(`/medications/${med._id}/history`)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View History
            </button>
          </div>
        </div>
      ))}

      {/* Menu */}
      {selectedMedication && (
        <div
          className={`fixed inset-0 z-50 ${
            menuAnchor ? 'block' : 'hidden'
          }`}
          onClick={handleMenuClose}
        >
          <div
            className="absolute right-4 top-4 bg-white rounded-lg shadow-lg py-2 w-48"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEdit}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationList; 