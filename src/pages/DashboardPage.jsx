import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EnhancedDashboard } from '@/features/dashboard/EnhancedDashboard';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <EnhancedDashboard />
    </DashboardLayout>
  );
}
