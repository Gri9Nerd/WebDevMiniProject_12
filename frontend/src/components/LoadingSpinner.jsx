const LoadingSpinner = ({ size = 'md', color = 'blue-600' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div 
      className="flex justify-center items-center"
      role="status"
      aria-label="Loading"
    >
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-${color}`}
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 