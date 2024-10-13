import React, { useEffect } from 'react';

const Toast = ({ type = 'success', message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer); // Clear the timer when component unmounts or re-renders
    }
  }, [show, duration, onClose]);

  // Bootstrap classes for different toast types
  const toastClasses = {
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white'
  };

  return (
    <div
      className={`toast position-fixed top-50 start-50 translate-middle m-3 ${show ? 'show' : 'hide'}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header ${toastClasses[type]}`}>
        <strong className="me-auto">{type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;
