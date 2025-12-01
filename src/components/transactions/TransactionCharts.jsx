import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from '@/components/ui/skeleton';
import { getTransactionTrends } from '@/services/analyticsService';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'sonner';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.dataKey === 'revenue' 
              ? `${entry.value.toLocaleString()} VNĐ` 
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Revenue Over Time Chart
export const RevenueOverTimeChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tính toán ngày mặc định: từ đầu tháng hiện tại đến hôm nay
  const getDefaultDateRange = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: firstDayOfMonth, endDate: now };
  };

  const defaultRange = getDefaultDateRange();
  const [filters, setFilters] = useState({
    period: '30d',  // Giữ lại để fallback
    granularity: 'daily',
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Tạo params với custom dates - format YYYY-MM-DD
        const params = {
          granularity: filters.granularity
        };

        if (filters.startDate && filters.endDate) {
          // Format ngày thành YYYY-MM-DD để backend xử lý đúng timezone VN
          const formatDateToYMD = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
          params.customStartDate = formatDateToYMD(filters.startDate);
          params.customEndDate = formatDateToYMD(filters.endDate);
        } else {
          params.period = filters.period;
        }

        const response = await getTransactionTrends(params);
        if (response.data.success) {
          // Directly use the data from the API as the backend now provides complete data
          setData(response.data.data.revenueOverTime);
        } else {
          setError('Không thể tải dữ liệu xu hướng doanh thu');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu xu hướng doanh thu');
        toast.error('Không thể tải dữ liệu biểu đồ doanh thu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng doanh thu</CardTitle>
          <CardDescription>Doanh thu theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng doanh thu</CardTitle>
          <CardDescription>Doanh thu theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Xu hướng doanh thu</CardTitle>
            <CardDescription>Doanh thu theo thời gian</CardDescription>
          </div>
         <div className="flex gap-2 items-center">
           {/* Chọn ngày bắt đầu */}
           <Popover>
             <PopoverTrigger asChild>
               <Button variant="outline" className="text-sm flex items-center gap-2">
                 <CalendarIcon className="w-4 h-4" />
                 {filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : "Ngày bắt đầu"}
               </Button>
             </PopoverTrigger>
             <PopoverContent className="p-0" align="start">
               <Calendar
                 mode="single"
                 selected={filters.startDate}
                 onSelect={(date) => {
                   if (date) {
                     setFilters(f => ({ ...f, startDate: date }));
                   }
                 }}
                 initialFocus
               />
             </PopoverContent>
           </Popover>

           {/* Chọn ngày kết thúc */}
           <Popover>
             <PopoverTrigger asChild>
               <Button variant="outline" className="text-sm flex items-center gap-2">
                 <CalendarIcon className="w-4 h-4" />
                 {filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : "Ngày kết thúc"}
               </Button>
             </PopoverTrigger>
             <PopoverContent className="p-0" align="start">
               <Calendar
                 mode="single"
                 selected={filters.endDate}
                 onSelect={(date) => {
                   if (date) {
                     setFilters(f => ({ ...f, endDate: date }));
                   }
                 }}
                 initialFocus
               />
             </PopoverContent>
           </Popover>
         </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(217, 91%, 60%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="Doanh thu"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Revenue by Role Chart
export const RevenueByRoleChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo Vai trò</CardTitle>
          <CardDescription>Phân bổ doanh thu theo loại người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = [
    'hsl(217, 91%, 60%)', // Blue
    'hsl(142, 76%, 36%)', // Green  
    'hsl(262, 83%, 58%)', // Purple
    'hsl(346, 87%, 43%)', // Pink
    'hsl(48, 96%, 53%)'   // Yellow
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo Vai trò</CardTitle>
        <CardDescription>Phân bổ doanh thu theo loại người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Revenue by Payment Method Chart
export const RevenueByPaymentMethodChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo Phương thức Thanh toán</CardTitle>
          <CardDescription>Phân bổ doanh thu theo phương thức</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo Phương thức Thanh toán</CardTitle>
        <CardDescription>Phân bổ doanh thu theo phương thức</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(217, 91%, 60%)" 
              radius={[4, 4, 0, 0]}
              name="Doanh thu"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Transaction Status Breakdown Chart
export const TransactionStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái Giao dịch</CardTitle>
          <CardDescription>Phân bổ giao dịch theo trạng thái</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = {
    'Thành công': 'hsl(142, 76%, 36%)', // Green
    'Thất bại': 'hsl(0, 84%, 60%)',     // Red  
    'Đang xử lý': 'hsl(48, 96%, 53%)',  // Yellow
    'Đã hủy': 'hsl(224, 71%, 62%)'      // Blue
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái Giao dịch</CardTitle>
        <CardDescription>Phân bổ giao dịch theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || 'hsl(var(--muted))'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Số giao dịch']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Top Spending Users Chart
export const TopSpendingUsersChart = ({ data, limit = 5 }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Người dùng Chi tiêu</CardTitle>
          <CardDescription>Bảng xếp hạng người dùng theo tổng chi tiêu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  const topUsers = data.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {limit} Người dùng Chi tiêu</CardTitle>
        <CardDescription>Bảng xếp hạng người dùng theo tổng chi tiêu</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={topUsers} 
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <YAxis 
              type="category"
              dataKey="email" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              width={90}
            />
            <Tooltip 
              formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Tổng chi tiêu']}
            />
            <Bar 
              dataKey="totalSpent" 
              fill="hsl(262, 83%, 58%)" 
              radius={[0, 4, 4, 0]}
              name="Tổng chi tiêu"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
