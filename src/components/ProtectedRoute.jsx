import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AppContext);
  
  // Show loading while checking authentication
  if (isAuthenticated === null || isAuthenticated === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Checking authentication...</span>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
