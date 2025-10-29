import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { t } from '@/constants/translations';
import { 
  Download,
  Filter,
  RefreshCw,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Bell
} from 'lucide-react';

// Import our new analytics components
import { 
  UserGrowthChart, 
  RevenueChart, 
  UserDemographicsChart, 
  JobCategoriesChart,
  ActivityOverviewChart 
} from '@/components/analytics/Charts';
import { EnhancedStatsCards, KPICards, SystemHealthCard } from '@/components/analytics/MetricCards';
import { EnhancedRecentActivity, TopCompaniesCard } from '@/components/analytics/ActivityFeed';

export function EnhancedDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting dashboard data...');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-gray-600">
            {t('dashboard.description')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? t('common.loading') : t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filters')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {t('common.export')}
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {t('common.dateRange')}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: t('dashboard.overview'), icon: BarChart3 },
          { id: 'analytics', label: t('dashboard.analytics'), icon: TrendingUp },
          { id: 'performance', label: t('dashboard.performance'), icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Based on Active Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EnhancedStatsCards />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <UserGrowthChart />
            <UserDemographicsChart />
            <JobCategoriesChart />
          </div>

          {/* Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EnhancedRecentActivity />
            <TopCompaniesCard />
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICards />
          </div>

          {/* Advanced Analytics Charts */}
          <div className="grid grid-cols-1 gap-6">
            <ActivityOverviewChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.trafficSources')}</CardTitle>
                <CardDescription>{t('dashboard.howUsersFindPlatform')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: t('dashboard.directTraffic'), value: 45, color: 'bg-blue-500' },
                    { name: t('dashboard.searchEngines'), value: 30, color: 'bg-green-500' },
                    { name: t('dashboard.socialMedia'), value: 15, color: 'bg-orange-500' },
                    { name: t('dashboard.referrals'), value: 10, color: 'bg-red-500' }
                  ].map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${source.color}`} />
                        <span className="text-sm font-medium">{source.name}</span>
                      </div>
                      <div className="text-sm font-semibold">{source.value}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <>
          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SystemHealthCard />
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t('dashboard.realTimeActivity')}</CardTitle>
                <CardDescription>Hoạt động nền tảng trực tiếp và tương tác người dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,834</div>
                      <div className="text-sm text-gray-600">{t('dashboard.onlineUsers')}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">45,678</div>
                      <div className="text-sm text-gray-600">{t('dashboard.apiCallsToday')}</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">145ms</div>
                      <div className="text-sm text-gray-600">{t('dashboard.avgResponse')}</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">0.1%</div>
                      <div className="text-sm text-gray-600">{t('dashboard.errorRate')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.databasePerformance')}</CardTitle>
                <CardDescription>{t('dashboard.databaseHealth')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: t('dashboard.queryResponseTime'), value: '23ms', status: 'excellent' },
                    { metric: t('dashboard.connectionPool'), value: '45/100', status: 'good' },
                    { metric: t('dashboard.cacheHitRate'), value: '94.2%', status: 'excellent' },
                    { metric: t('dashboard.diskUsage'), value: '67%', status: 'good' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{item.value}</span>
                        <Badge 
                          variant="outline" 
                          className={
                            item.status === 'excellent' ? 'text-green-600 border-green-600' :
                            item.status === 'good' ? 'text-blue-600 border-blue-600' :
                            'text-yellow-600 border-yellow-600'
                          }
                        >
                          {item.status === 'excellent' ? t('dashboard.excellent') :
                           item.status === 'good' ? t('dashboard.good') :
                           t('dashboard.warning')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.securityOverview')}</CardTitle>
                <CardDescription>{t('dashboard.securityEvents')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">{t('dashboard.securityStatus')}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{t('dashboard.secure')}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('dashboard.failedLoginAttempts')}</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('dashboard.blockedIPAddresses')}</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('dashboard.lastSecurityScan')}</span>
                      <span className="font-semibold">2 {t('dashboard.hoursAgo')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}