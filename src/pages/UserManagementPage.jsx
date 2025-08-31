import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { UserManagement } from '@/features/users/UserManagement';

export function UserManagementPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
}
