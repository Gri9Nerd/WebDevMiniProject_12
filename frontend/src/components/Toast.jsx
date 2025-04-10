import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 300); // Match animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }[type];

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center min-w-[200px]`}>
        <span className="mr-2 font-bold">{icon}</span>
        <span className="flex-1">{message}</span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setVisible(false);
              onClose?.();
            }, 300);
          }}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast; 