import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { CompanyDetail } from '@/features/companies/CompanyDetail';

export function CompanyDetailPage() {
  return (
    <DashboardLayout>
      <CompanyDetail />
    </DashboardLayout>
  );
}
