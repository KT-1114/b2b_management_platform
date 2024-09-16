import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Check for `user` state
  const location = useLocation();

  return user ? (
    children // Render children (Home page) if authenticated
  ) : (
    <Navigate to="/auth" state={{ from: location }} />
  );
};

export default ProtectedRoute;
