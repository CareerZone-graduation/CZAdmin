import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { t } from '@/constants/translations';
import { 
  RefreshCw,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// Import our new analytics components
import { 
  UserGrowthChart, 
  RevenueChart, 
  UserDemographicsChart, 
  JobCategoriesChart,
  ActivityOverviewChart 
} from '@/components/analytics/Charts';
import { EnhancedStatsCards, KPICards } from '@/components/analytics/MetricCards';

export function EnhancedDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };



  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Section - Simplified */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('dashboard.description')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="bg-white">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? t('common.loading') : t('common.refresh')}
          </Button>
        
        </div>
      </div>

      {/* Tab Navigation - Modern Design */}
      <div className="flex space-x-2 bg-white p-1.5 rounded-xl shadow-sm w-fit border border-gray-200">
        {[
          { id: 'overview', label: t('dashboard.overview'), icon: BarChart3 },
          { id: 'analytics', label: t('dashboard.analytics'), icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
          {/* Enhanced Stats Grid - 4 cards in a row like the design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <EnhancedStatsCards />
          </div>

          {/* Charts Section - Mỗi biểu đồ một hàng */}
          <div className="grid grid-cols-1 gap-6">
            <UserGrowthChart />
            <UserDemographicsChart />
            <JobCategoriesChart />
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
          
          </div>
        </>
      )}
    </div>
  );
}