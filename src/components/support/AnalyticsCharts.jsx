import React from 'react';
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp 
} from 'lucide-react';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Metrics Cards Component
export const MetricsCards = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return 'N/A';
    if (minutes < 60) return `${Math.round(minutes)} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const metrics = [
    {
      title: 'Tổng yêu cầu',
      value: analytics?.totalRequests || 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Thời gian phản hồi TB',
      value: formatTime(analytics?.avgResponseTime),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Thời gian giải quyết TB',
      value: formatTime(analytics?.avgResolutionTime),
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Tỷ lệ giải quyết',
      value: analytics?.resolutionRate 
        ? `${analytics.resolutionRate.toFixed(1)}%` 
        : 'N/A',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {metric.value}
                  </p>
                </div>
                <div className={`${metric.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Status Pie Chart Component
export const StatusPieChart = ({ data, loading }) => {
  const COLORS = {
    'pending': '#EAB308',      // yellow
    'in-progress': '#3B82F6',  // blue
    'resolved': '#10B981',     // green
    'closed': '#6B7280'        // gray
  };

  const STATUS_LABELS = {
    'pending': 'Đang chờ',
    'in-progress': 'Đang xử lý',
    'resolved': 'Đã giải quyết',
    'closed': 'Đã đóng'
  };

  const chartData = data?.countByStatus?.map(item => ({
    name: STATUS_LABELS[item._id] || item._id,
    value: item.count,
    color: COLORS[item._id] || '#6B7280'
  })) || [];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    
    if (percent < 0.05) return null; // Don't show label if less than 5%
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Phân bổ theo Trạng thái</CardTitle>
        <CardDescription className="text-sm">
          Số lượng yêu cầu theo từng trạng thái
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Category Bar Chart Component
export const CategoryBarChart = ({ data, loading }) => {
  const CATEGORY_LABELS = {
    'technical-issue': 'Vấn đề kỹ thuật',
    'account-issue': 'Vấn đề tài khoản',
    'payment-issue': 'Vấn đề thanh toán',
    'job-posting-issue': 'Vấn đề đăng tin',
    'application-issue': 'Vấn đề ứng tuyển',
    'general-inquiry': 'Thắc mắc chung'
  };

  const COLORS = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // orange
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899'  // pink
  ];

  const chartData = data?.countByCategory?.map((item, index) => ({
    category: CATEGORY_LABELS[item._id] || item._id,
    count: item.count,
    color: COLORS[index % COLORS.length]
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Phân bổ theo Danh mục</CardTitle>
        <CardDescription className="text-sm">
          Số lượng yêu cầu theo từng danh mục
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <BarChart 
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name="Số lượng"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Combined Analytics Charts Component
export const AnalyticsCharts = ({ analytics, loading }) => {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <MetricsCards analytics={analytics} loading={loading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart data={analytics} loading={loading} />
        <CategoryBarChart data={analytics} loading={loading} />
      </div>
    </div>
  );
};
