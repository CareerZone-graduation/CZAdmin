import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { UserDetail } from '@/features/users/UserDetail';

export function UserDetailPage() {
  return (
    <DashboardLayout>
      <UserDetail />
    </DashboardLayout>
  );
}
