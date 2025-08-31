import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { CompanyManagement } from '@/features/companies/CompanyManagement';

export function CompanyManagementPage() {
  return (
    <DashboardLayout>
      <CompanyManagement />
    </DashboardLayout>
  );
}
