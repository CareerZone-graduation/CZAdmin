import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  Award,
  BarChart3,
  Globe
} from 'lucide-react';
import { getDashboardStats, getKPIMetrics } from '@/services/analyticsService';
import { systemHealth } from '@/data/analyticsData'; // Will be deprecated
import { Skeleton } from '@/components/ui/skeleton';
import { t } from '@/constants/translations';

// Enhanced Metric Card Component with gradient backgrounds
const MetricCard = ({ title, value, change, trend, icon: Icon, description, color = "blue" }) => {
  // Gradient backgrounds cho từng màu
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    green: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    red: "bg-gradient-to-br from-red-500 to-red-600 text-white",
    indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
  };

  // Icon background với màu trắng nhạt
  const iconBgClasses = {
    blue: "bg-white/20",
    green: "bg-white/20",
    orange: "bg-white/20",
    purple: "bg-white/20",
    red: "bg-white/20",
    indigo: "bg-white/20"
  };

  const trendColor = trend === 'up' ? 'text-white/90' : trend === 'down' ? 'text-white/90' : 'text-white/80';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300 ${colorClasses[color]} rounded-2xl`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-medium text-white/80 uppercase tracking-wide">{title}</CardTitle>
        <div className={`p-3 rounded-xl ${iconBgClasses[color]} backdrop-blur-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="text-4xl font-bold text-white mb-2 tracking-tight">{value}</div>
        <div className={`flex items-center text-sm ${trendColor} font-medium`}>
          <TrendIcon className="w-4 h-4 mr-1" />
          {change}
          {description && <span className="text-white/70 ml-1 text-xs">{t('dashboard.fromLastMonth')}</span>}
        </div>
        {description && (
          <p className="text-xs text-white/70 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

// System Health Card
export const SystemHealthCard = () => {
  const getHealthColor = (value) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          {t('dashboard.systemHealthTitle')}
        </CardTitle>
        <CardDescription>{t('dashboard.platformPerformance')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('dashboard.uptime')}</span>
            <Badge variant="outline" className="text-green-600">
              {systemHealth.uptime}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('dashboard.serverLoad')}</span>
              <span className="text-sm text-gray-600">{systemHealth.serverLoad}%</span>
            </div>
            <Progress value={systemHealth.serverLoad} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('dashboard.responseTime')}</span>
            <Badge variant="outline" className="text-blue-600">
              {systemHealth.responseTime}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('dashboard.activeUsers')}</span>
            <span className="text-sm font-semibold text-gray-900">
              {systemHealth.activeUsers.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('dashboard.errorRate')}</span>
            <Badge variant="outline" className="text-green-600">
              {systemHealth.errorRate}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// KPI Cards Grid - Updated to use real data from MongoDB
export const KPICards = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);
        const response = await getKPIMetrics();
        const data = response.data.data;
        
        // Transform API response to component format
        const formattedKPI = [
          {
            title: 'Tỷ lệ ứng tuyển thành công',
            value: data.applicationSuccessRate.value,
            change: data.applicationSuccessRate.change,
            trend: data.applicationSuccessRate.trend,
            description: data.applicationSuccessRate.description
          },
          {
            title: 'Thời gian tuyển dụng TB',
            value: data.averageTimeToHire.value,
            change: data.averageTimeToHire.change,
            trend: data.averageTimeToHire.trend,
            description: data.averageTimeToHire.description
          },
          {
            title: 'Tương tác người dùng',
            value: data.userEngagement.value,
            change: data.userEngagement.change,
            trend: data.userEngagement.trend,
            description: data.userEngagement.description
          },
          {
            title: 'Doanh thu nền tảng',
            value: data.platformRevenue.value,
            change: data.platformRevenue.change,
            trend: data.platformRevenue.trend,
            description: data.platformRevenue.description
          }
        ];
        
        setKpiData(formattedKPI);
        setError(null);
      } catch (err) {
        console.error('Error fetching KPI metrics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <Card className="col-span-4">
        <CardContent className="pt-6">
          <p className="text-red-600">Lỗi khi tải dữ liệu KPI: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!kpiData) return null;

  const icons = [Target, Clock, Users, DollarSign];
  const colors = ['blue', 'green', 'purple', 'orange'];

  return (
    <>
      {kpiData.map((kpi, index) => {
        const Icon = icons[index % icons.length];
        
        return (
          <MetricCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={Icon}
            description={kpi.description}
            color={colors[index % colors.length]}
          />
        );
      })}
    </>
  );
};

// Enhanced Stats Cards with current metrics
export const EnhancedStatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        const data = response.data.data; // apiClient automatically extracts data
        
        const formattedStats = [
          {
            title: t('dashboard.totalUsers'),
            value: data.totalUsers.toLocaleString(),
            change: `${data.growth.users >= 0 ? '+' : ''}${data.growth.users}%`,
            trend: data.growth.users >= 0 ? 'up' : 'down',
            icon: Users,
            color: 'blue'
          },
          {
            title: t('dashboard.activeCompanies'),
            value: data.activeCompanies.toLocaleString(),
            change: `${data.growth.companies >= 0 ? '+' : ''}${data.growth.companies}%`,
            trend: data.growth.companies >= 0 ? 'up' : 'down',
            icon: Building2,
            color: 'green'
          },
          {
            title: t('dashboard.jobListings'),
            value: data.jobListings.toLocaleString(),
            change: `${data.growth.jobs >= 0 ? '+' : ''}${data.growth.jobs}%`,
            trend: data.growth.jobs >= 0 ? 'up' : 'down',
            icon: Briefcase,
            color: 'purple'
          },
          {
            title: `Doanh thu tháng ${data.currentMonth || new Date().getMonth() + 1}`,
            value: `${(data.currentMonthRevenue || 0).toLocaleString()} VNĐ`,
            change: `${data.growth.revenue >= 0 ? '+' : ''}${data.growth.revenue}% so với tháng trước`,
            trend: data.growth.revenue >= 0 ? 'up' : 'down',
            icon: DollarSign,
            color: 'orange'
          },
          {
            title: t('dashboard.totalApplications'),
            value: data.totalApplications.toLocaleString(),
            change: `${data.growth.applications >= 0 ? '+' : ''}${data.growth.applications}%`,
            trend: data.growth.applications >= 0 ? 'up' : 'down',
            icon: BarChart3,
            color: 'indigo'
          },
          {
            title: t('dashboard.totalInterviews'),
            value: data.totalInterviews.toLocaleString(),
            change: `${data.growth.interviews >= 0 ? '+' : ''}${data.growth.interviews}%`,
            trend: data.growth.interviews >= 0 ? 'up' : 'down',
            icon: Award,
            color: 'red'
          }
        ];
        setStats(formattedStats);
      } catch (err) {
        setError(t('dashboard.failedToFetchStats'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return Array.from({ length: 6 }).map((_, index) => (
      <Card key={index}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    ));
  }

  if (error) {
    return <div className="col-span-full text-red-500">{error}</div>;
  }

  return (
    <>
      {stats.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </>
  );
};