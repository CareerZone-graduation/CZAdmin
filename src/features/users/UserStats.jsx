import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserX, Building2, Edit3, Shield, ShieldAlert } from 'lucide-react';
import { getSystemStats } from '@/services/companyService';

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <Card className={`${gradient} border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow`}>
    <CardContent className="p-5 text-center">
      <div className="flex justify-center mb-2">
        <Icon className="w-7 h-7 text-white/90" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/80 font-medium uppercase tracking-wide">{title}</div>
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
      <StatCard title="Tổng Ứng viên" value={stats.users?.candidates ?? 0} icon={Users} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
      <StatCard title="Tổng NTD" value={stats.users?.recruiters ?? 0} icon={UserCheck} gradient="bg-gradient-to-br from-green-500 to-green-600" />
      <StatCard title="NTD chưa ĐK công ty" value={stats.companies?.recruitersWithoutCompany ?? 0} icon={Edit3} gradient="bg-gradient-to-br from-orange-500 to-orange-600" />
      <StatCard title="Công ty chờ duyệt" value={stats.companies?.pending ?? 0} icon={Building2} gradient="bg-gradient-to-br from-yellow-500 to-yellow-600" />
      <StatCard title="Tài khoản bị khóa" value={stats.users?.banned ?? 0} icon={UserX} gradient="bg-gradient-to-br from-red-500 to-red-600" />
      <StatCard title="Tổng người dùng" value={stats.overview?.totalUsers ?? 0} icon={Shield} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
    </div>
  );
}