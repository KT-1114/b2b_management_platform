import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { user ,loading } = useAuth();
  const location = useLocation();

  if(loading) {
    return <div>Loading</div>
  }
  
  return user ? (
    children // Render children (Home page) if authenticated
  ) : (
    <>
      <Navigate to="/rolePage" state={{ from: location }} />
    </>
  );
};

export default ProtectedRoute;
