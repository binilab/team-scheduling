import React from 'react';

interface ToastProps {
  message: string;
  duration?: number; // Duration in milliseconds
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg">
      {message}
    </div>
  );
};

export default Toast;