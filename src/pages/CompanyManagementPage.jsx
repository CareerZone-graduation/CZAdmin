import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EnhancedCompanyManagement } from '@/features/companies/EnhancedCompanyManagement';

export function CompanyManagementPage() {
  return (
    <DashboardLayout>
      <EnhancedCompanyManagement />
    </DashboardLayout>
  );
}
