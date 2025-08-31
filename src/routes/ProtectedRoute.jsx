import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role admin
  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
