import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserGrowth, getRevenueTrends, getUserDemographics, getJobCategories } from '@/services/analyticsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.dataKey === 'revenue' 
              ? `${entry.value.toLocaleString()} VNĐ` 
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// User Growth Chart Component
export const UserGrowthChart = () => {
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
  console.log('🔄 useEffect triggered! Filters changed:', JSON.stringify(filters, null, 2));
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Frontend filters state:', filters);
      
      // Tạo params object
      const params = {
        granularity: filters.granularity
      };
      
      // Ưu tiên custom dates, nếu không có thì dùng period
      if (filters.startDate && filters.endDate) {
        // Gửi ngày dạng YYYY-MM-DD để backend xử lý đúng múi giờ VN
        const formatDate = (date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        params.customStartDate = formatDate(filters.startDate);
        params.customEndDate = formatDate(filters.endDate);
        console.log('📅 Sending custom dates:', params.customStartDate, params.customEndDate);
      } else {
        params.period = filters.period;
        console.log('📅 Sending period:', params.period);
      }
      const [revenueRes, usersRes] = await Promise.all([
  getRevenueTrends(params),
  getUserGrowth(params)
]);
      
      console.log('🔍 Final API params:', params);
      const response = await getUserGrowth(params);
      console.log('✅ API response:', response.data);
      setData(response.data.data);
    } catch (err) {
      setError('Failed to fetch user growth data.');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [filters]);

  return (
    <Card className="col-span-2 rounded-2xl shadow-sm border-gray-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Xu hướng tăng trưởng người dùng</CardTitle>
            <CardDescription className="text-sm">Đăng ký người dùng theo thời gian</CardDescription>
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
                    console.log('📅 StartDate clicked - raw date:', date);
                    console.log('📅 Date type:', typeof date, date instanceof Date);
                    console.log('📅 Current filters BEFORE update:', JSON.stringify(filters, null, 1));
                    if (date) {
                      setFilters(f => {
                        const newFilters = { ...f, startDate: date };
                        console.log('📅 New filters AFTER startDate update:', JSON.stringify(newFilters, null, 1));
                        return newFilters;
                      });
                    }
                  }}
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
                    console.log('📅 EndDate clicked - raw date:', date);
                    console.log('📅 Date type:', typeof date, date instanceof Date);
                    console.log('📅 Current filters BEFORE update:', JSON.stringify(filters, null, 2));
                    if (date) {
                      setFilters(f => {
                        const newFilters = { ...f, endDate: date };
                        console.log('📅 New filters AFTER endDate update:', JSON.stringify(newFilters, null, 2));
                        return newFilters;
                      });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
                name="Người dùng mới"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Revenue Analytics Chart
export const RevenueChart = () => {
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
        
        // Tạo params với custom dates
        const params = {
          granularity: filters.granularity
        };
        
        if (filters.startDate && filters.endDate) {
          // Gửi ngày dạng YYYY-MM-DD
          const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
          params.customStartDate = formatDate(filters.startDate);
          params.customEndDate = formatDate(filters.endDate);
        } else {
          params.period = filters.period;
        }
        
        const response = await getRevenueTrends(params);
        setData(response.data.data);
      } catch (err) {
        setError('Failed to fetch revenue data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Quick preset date ranges
  const setPresetRange = (preset) => {
    const now = new Date();
    let startDate, endDate = now;

    switch(preset) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        return;
    }

    setFilters(f => ({ ...f, startDate, endDate }));
  };

  return (
    <Card className="col-span-2 rounded-2xl shadow-sm border-gray-200">
      <CardHeader>
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Xu hướng Doanh thu</CardTitle>
              <CardDescription className="text-sm">Doanh thu theo thời gian (VNĐ)</CardDescription>
            </div>
          </div>
          
          {/* Quick presets and date pickers */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Quick preset buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetRange('7d')}
                className="text-xs h-8"
              >
                7 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetRange('30d')}
                className="text-xs h-8"
              >
                30 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetRange('90d')}
                className="text-xs h-8"
              >
                90 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetRange('thisMonth')}
                className="text-xs h-8"
              >
                Tháng này
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetRange('lastMonth')}
                className="text-xs h-8"
              >
                Tháng trước
              </Button>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Separate start and end date pickers */}
            <div className="flex gap-2">
              {/* Chọn ngày bắt đầu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-xs h-8 flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" />
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
                  <Button variant="outline" className="text-xs h-8 flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" />
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
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Doanh thu (VNĐ)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// User Demographics Pie Chart
export const UserDemographicsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUserDemographics();
        setData(response.data.data);
      } catch (err) {
        setError('Failed to fetch user demographics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="rounded-2xl shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Thông tin mô tả đặc điểm người dùng</CardTitle>
        <CardDescription className="text-sm">Phân phối người dùng theo vai trò</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Job Categories Chart
export const JobCategoriesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#3B82F6', '#F97316', '#84CC16', '#D946EF'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getJobCategories();
        setData(response.data.data);
      } catch (err) {
        setError('Failed to fetch job categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="rounded-2xl shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Những ngành nghề phổ biến nhất</CardTitle>
        <CardDescription className="text-sm">Top 10 danh mục công việc đang hoạt động nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis 
                dataKey="category" 
                type="category" 
                stroke="#6b7280" 
                fontSize={11} 
                width={180}
                tick={{ fill: '#374151' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Combined Activity Chart
export const ActivityOverviewChart = () => {
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
    period: '30d', 
    granularity: 'daily',
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Tạo params với custom dates
        const params = {
          granularity: filters.granularity
        };
        
        if (filters.startDate && filters.endDate) {
          // Gửi ngày dạng YYYY-MM-DD
          const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
          params.customStartDate = formatDate(filters.startDate);
          params.customEndDate = formatDate(filters.endDate);
        } else {
          params.period = filters.period;
        }
        
        // Fetch both datasets in parallel
        const [revenueRes, usersRes] = await Promise.all([
          getRevenueTrends(params),
          getUserGrowth(params)
        ]);

        const revenueData = revenueRes.data.data;
        const usersData = usersRes.data.data;

        // Merge the data based on the date
        const mergedData = revenueData.map(revItem => {
          const userItem = usersData.find(usrItem => usrItem.date === revItem.date);
          return {
            ...revItem,
            users: userItem ? userItem.users : 0,
          };
        });

        setData(mergedData);

      } catch (err) {
        setError('Failed to fetch activity data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <Card className="col-span-3 rounded-2xl shadow-sm border-gray-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Tổng quan về hoạt động của nền tảng</CardTitle>
            <CardDescription className="text-sm">Xu hướng người dùng, công việc và ứng dụng</CardDescription>
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
        <ResponsiveContainer width="100%" height={350}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="users" name="Người dùng mới" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="job_postings" stroke="#10B981" strokeWidth={2} name="Tin tuyển dụng" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="applications" stroke="#F59E0B" strokeWidth={2} name="Đơn ứng tuyển" dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};