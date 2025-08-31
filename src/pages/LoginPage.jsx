import React from 'react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
