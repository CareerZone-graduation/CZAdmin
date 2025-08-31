import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CompanyManagementPage } from '@/pages/CompanyManagementPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { JobManagementPage } from '@/pages/JobManagementPage';
import { TransactionManagementPage } from '@/pages/TransactionManagementPage';

function AppRouter() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      } />
      
      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/companies" element={
        <ProtectedRoute>
          <CompanyManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <UserManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/jobs" element={
        <ProtectedRoute>
          <JobManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <TransactionManagementPage />
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
