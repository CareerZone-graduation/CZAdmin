import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { JobManagement } from '@/features/jobs/JobManagement';

export function JobManagementPage() {
  return (
    <DashboardLayout>
      <JobManagement />
    </DashboardLayout>
  );
}
