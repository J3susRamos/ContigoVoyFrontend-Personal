import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  progress?: {
    current: number;
    total: number;
  };
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Cargando...',
  progress
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const progressPercentage = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center space-x-2">
        <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin`}></div>
        {text && <span className="text-gray-600 dark:text-gray-300">{text}</span>}
      </div>

      {progress && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>Progreso</span>
            <span>{progress.current}/{progress.total} ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;