import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Dashboard } from '@/features/dashboard/Dashboard';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
