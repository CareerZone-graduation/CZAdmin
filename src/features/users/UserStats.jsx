import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserX, Building2, Edit3, Shield, ShieldAlert } from 'lucide-react';
import { getSystemStats } from '@/services/companyService';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function UserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getSystemStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard title="Tổng Ứng viên" value={stats.users?.candidates ?? 0} icon={Users} />
      <StatCard title="Tổng NTD" value={stats.users?.recruiters ?? 0} icon={UserCheck} color="text-blue-500" />
      <StatCard title="NTD chưa ĐK công ty" value={stats.companies?.recruitersWithoutCompany ?? 0} icon={Edit3} color="text-orange-500" />
      <StatCard title="Công ty chờ duyệt" value={stats.companies?.pending ?? 0} icon={Building2} color="text-yellow-500" />
      <StatCard title="Tài khoản bị khóa" value={stats.users?.banned ?? 0} icon={UserX} color="text-red-500" />
      <StatCard title="Tổng người dùng" value={stats.overview?.totalUsers ?? 0} icon={Shield} color="text-gray-500" />
    </div>
  );
}