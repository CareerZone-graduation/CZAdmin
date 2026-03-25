import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AIModeratedJobs } from '@/features/jobs/AIModeratedJobs';

export function AIModeratedJobsPage() {
  return (
    <DashboardLayout>
      <AIModeratedJobs />
    </DashboardLayout>
  );
}
