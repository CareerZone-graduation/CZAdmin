import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthRoute } from './AuthRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CompanyManagementPage } from '@/pages/CompanyManagementPage';
import { CompanyDetailPage } from '@/pages/CompanyDetailPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { UserDetailPage } from '@/pages/UserDetailPage';
import { JobManagementPage } from '@/pages/JobManagementPage';
import { TransactionManagementPage } from '@/pages/TransactionManagementPage';
import { AdminSupportDashboard } from '@/pages/support/AdminSupportDashboard';
import { AdminSupportRequestDetail } from '@/pages/support/AdminSupportRequestDetail';
import { SupportAnalyticsPage } from '@/pages/support/SupportAnalyticsPage';

function AppRouter() {
  const { initializing } = useSelector(state => state.auth);

  // Hiển thị loading khi đang khôi phục authentication
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

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
      <Route path="/companies/:id" element={
        <ProtectedRoute>
          <CompanyDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <UserManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/users/:id" element={
        <ProtectedRoute>
          <UserDetailPage />
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
      <Route path="/support" element={
        <ProtectedRoute>
          <AdminSupportDashboard />
        </ProtectedRoute>
      } />
      <Route path="/support/:id" element={
        <ProtectedRoute>
          <AdminSupportRequestDetail />
        </ProtectedRoute>
      } />
      <Route path="/support/analytics" element={
        <ProtectedRoute>
          <SupportAnalyticsPage />
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
