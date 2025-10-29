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
import { getDashboardStats } from '@/services/analyticsService';
import { kpiData, systemHealth } from '@/data/analyticsData'; // Keep these for now, will be replaced later
import { Skeleton } from '@/components/ui/skeleton';
import { t } from '@/constants/translations';

// Enhanced Metric Card Component
const MetricCard = ({ title, value, change, trend, icon: Icon, description, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    red: "text-red-600 bg-red-50",
    indigo: "text-indigo-600 bg-indigo-50"
  };

  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className={`flex items-center text-xs ${trendColor} mt-1`}>
          <TrendIcon className="w-3 h-3 mr-1" />
          {change}
          {description && <span className="text-gray-500 ml-1">{t('dashboard.fromLastMonth')}</span>}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
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

// KPI Cards Grid
export const KPICards = () => {
  return (
    <>
      {kpiData.map((kpi, index) => {
        const icons = [Target, Clock, Users, DollarSign];
        const colors = ['blue', 'green', 'purple', 'orange'];
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
            title: t('dashboard.monthlyRevenue'),
            value: `$${data.monthlyRevenue.toLocaleString()}`,
            change: `${data.growth.revenue >= 0 ? '+' : ''}${data.growth.revenue}%`,
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