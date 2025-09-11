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

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend && trendValue !== undefined && (
            <>
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(trendValue)}%
              </span>
            </>
          )}
          <span>{description}</span>
        </div>
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
  const [period, setPeriod] = useState('7d');
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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
          <h2 className="text-2xl font-bold">Phân tích Giao dịch</h2>
          <p className="text-muted-foreground">
            Theo dõi và phân tích các giao dịch trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="analytics-period" className="text-sm font-medium">
              Khoảng thời gian:
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="analytics-period" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 ngày</SelectItem>
                <SelectItem value="30d">30 ngày</SelectItem>
                <SelectItem value="90d">3 tháng</SelectItem>
                <SelectItem value="1y">1 năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="granularity" className="text-sm font-medium">
              Chi tiết:
            </label>
            <Select value={granularity} onValueChange={setGranularity}>
              <SelectTrigger id="granularity" className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Ngày</SelectItem>
                <SelectItem value="weekly">Tuần</SelectItem>
                <SelectItem value="monthly">Tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      

      {/* Today's Statistics */}
      {todayStats && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Thống kê Hôm nay</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Doanh thu Hôm nay"
              value={formatCurrency(todayStats.todayRevenue)}
              description={`${todayStats.date}`}
              icon={DollarSign}
              loading={loading}
            />
            <MetricCard
              title="Tổng Giao dịch"
              value={formatNumber(todayStats.totalTransactions)}
              description={`Tỷ lệ thành công: ${todayStats.successRate.toFixed(1)}%`}
              icon={CreditCard}
              loading={loading}
            />
            <MetricCard
              title="Giao dịch Thành công"
              value={formatNumber(todayStats.successfulTransactions)}
              description="giao dịch hoàn thành"
              icon={CheckCircle}
              loading={loading}
            />
            <MetricCard
              title="Xu được Nạp"
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="top-users-period" className="text-sm font-medium">
                Khoảng thời gian:
              </label>
              <Select value={topUsersPeriod} onValueChange={setTopUsersPeriod}>
                <SelectTrigger id="top-users-period" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                  <SelectItem value="90d">3 tháng</SelectItem>
                  <SelectItem value="1y">1 năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <TopUsersTable users={topUsers} loading={loading} period={topUsersPeriod} />
      </div>
    </div>
  );
};
