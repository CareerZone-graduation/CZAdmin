import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { TransactionManagement } from '@/features/transactions/TransactionManagement';

export function TransactionManagementPage() {
  return (
    <DashboardLayout>
      <TransactionManagement />
    </DashboardLayout>
  );
}
