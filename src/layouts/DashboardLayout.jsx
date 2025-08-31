import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export function DashboardLayout({ children, className }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className={`p-8 ${className || ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
