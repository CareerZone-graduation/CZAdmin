import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function UserListSkeleton({ className }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full md:w-[180px] bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full md:w-[180px] bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
