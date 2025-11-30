import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  RevenueOverTimeChart, 
  RevenueByRoleChart, 
  RevenueByPaymentMethodChart, 
  TransactionStatusChart
} from './TransactionCharts';
import { TopUsersTable } from './TopUsersTable';
import { 
  getTransactionTrends, 
  getTransactionToday, 
  getTopSpendingUsers 
} from '@/services/analyticsService';

import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatDate';

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue, 
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  // Determine gradient color based on card type (you can customize this logic)
  const getGradient = () => {
    if (title.includes('Doanh thu')) return 'bg-gradient-to-br from-green-500 to-green-600';
    if (title.includes('Tổng')) return 'bg-gradient-to-br from-blue-500 to-blue-600';
    if (title.includes('Thành công')) return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
    if (title.includes('Xu')) return 'bg-gradient-to-br from-purple-500 to-purple-600';
    if (title.includes('xử lý')) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    if (title.includes('Thất bại')) return 'bg-gradient-to-br from-red-500 to-red-600';
    return 'bg-gradient-to-br from-indigo-500 to-indigo-600';
  };

  return (
    <Card className={`${getGradient()} border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow ${className}`}>
      <CardContent className="p-5 text-center">
        <div className="flex justify-center mb-2">
          <Icon className="w-7 h-7 text-white/90" />
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="flex items-center justify-center gap-1 text-xs text-white/80">
          {trend && trendValue !== undefined && (
            <>
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-white" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-white" />
              )}
              <span className="text-white font-semibold">
                {Math.abs(trendValue)}%
              </span>
            </>
          )}
          <span className="font-medium">{description}</span>
        </div>
        <div className="text-xs text-white/70 mt-1 uppercase tracking-wide">{title}</div>
      </CardContent>
    </Card>
  );
};

export const TransactionAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [granularity, setGranularity] = useState('daily');
  const [topUsersPeriod, setTopUsersPeriod] = useState('30d');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trendsResponse, todayResponse, topUsersResponse] = await Promise.all([
        getTransactionTrends({ period, granularity }),
        getTransactionToday(),
        getTopSpendingUsers({ period: topUsersPeriod })
      ]);

      if (trendsResponse.data.success) {
        setAnalyticsData(trendsResponse.data.data);
      } else {
        throw new Error('Failed to fetch transaction trends');
      }

      if (todayResponse.data.success) {
        setTodayStats(todayResponse.data.data);
      } else {
        throw new Error('Failed to fetch today stats');
      }

      if (topUsersResponse.data.success) {
        setTopUsers(topUsersResponse.data.data);
      } else {
        throw new Error('Failed to fetch top users');
      }

    } catch (err) {
      setError('Không thể tải dữ liệu phân tích. Vui lòng thử lại.');
      toast.error('Lỗi khi tải dữ liệu analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period, granularity, topUsersPeriod]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                onClick={fetchAnalyticsData}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Phân tích giao dịch</h2>
          <p className="text-muted-foreground">
            Theo dõi và phân tích các giao dịch trong hệ thống
          </p>
        </div>
      </div>
      

      {/* Today's Statistics */}
      {todayStats && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Thống kê hôm nay</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Doanh thu hôm nay"
              value={formatCurrency(todayStats.todayRevenue)}
              description={`${todayStats.date}`}
              icon={DollarSign}
              loading={loading}
            />
            <MetricCard
              title="Tổng giao dịch"
              value={formatNumber(todayStats.totalTransactions)}
              description={`Tỷ lệ thành công: ${todayStats.successRate.toFixed(1)}%`}
              icon={CreditCard}
              loading={loading}
            />
            <MetricCard
              title="Giao dịch thành công"
              value={formatNumber(todayStats.successfulTransactions)}
              description="giao dịch hoàn thành"
              icon={CheckCircle}
              loading={loading}
            />
            <MetricCard
              title="Xu được nạp"
              value={formatNumber(todayStats.totalCoinsRecharged)}
              description={`Trung bình: ${formatCurrency(todayStats.averageTransactionValue)}`}
              icon={TrendingUp}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Overview Statistics */}
      {analyticsData?.summary && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Tổng quan {period}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Tổng Doanh thu"
              value={formatCurrency(analyticsData.summary.totalRevenue)}
              description={`${formatNumber(analyticsData.summary.totalTransactions)} giao dịch`}
              icon={DollarSign}
              loading={loading}
            />
            <MetricCard
              title="Thành công"
              value={formatNumber(analyticsData.summary.successfulTransactions)}
              description={`Tỷ lệ: ${analyticsData.summary.successRate}%`}
              icon={CheckCircle}
              loading={loading}
            />
            <MetricCard
              title="Đang xử lý"
              value={formatNumber(analyticsData.summary.pendingTransactions)}
              description="giao dịch"
              icon={Clock}
              loading={loading}
            />
            <MetricCard
              title="Thất bại"
              value={formatNumber(analyticsData.summary.failedTransactions)}
              description="giao dịch"
              icon={XCircle}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Revenue Over Time Chart */}
      <RevenueOverTimeChart />

      {/* Charts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <RevenueByRoleChart data={analyticsData.revenueByRole} />
          <RevenueByPaymentMethodChart data={analyticsData.revenueByPaymentMethod} />
          <TransactionStatusChart data={analyticsData.transactionStatusBreakdown} />
        </div>
      )}

      {/* Top Users Ranking Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Top Người dùng Chi tiêu</h3>
            <p className="text-sm text-muted-foreground">
              Xếp hạng người dùng có tổng chi tiêu cao nhất
            </p>
          </div>
        </div>
        <TopUsersTable users={topUsers} loading={loading} period={topUsersPeriod} />
      </div>
    </div>
  );
};
