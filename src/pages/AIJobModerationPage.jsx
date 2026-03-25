import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AIJobModeration } from '@/features/jobs/AIJobModeration';

export function AIJobModerationPage() {
  return (
    <DashboardLayout>
      <AIJobModeration />
    </DashboardLayout>
  );
}
