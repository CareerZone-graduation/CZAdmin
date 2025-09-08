import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserGrowth, getRevenueTrends, getUserDemographics, getJobCategories } from '@/services/analyticsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.dataKey === 'revenue' 
              ? `$${entry.value.toLocaleString()}` 
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
  const [filters, setFilters] = useState({ period: '30d', granularity: 'daily' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUserGrowth(filters);
        setData(response.data.data);
      } catch (err) {
        setError('Failed to fetch user growth data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>User registrations over time</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filters.period} onValueChange={(value) => setFilters(f => ({...f, period: value}))}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.granularity} onValueChange={(value) => setFilters(f => ({...f, granularity: value}))}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
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
              <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
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
  const [filters, setFilters] = useState({ period: '30d', granularity: 'daily' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRevenueTrends(filters);
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

  return (
    <Card className="col-span-2">
       <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Revenue, job postings, and applications</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filters.period} onValueChange={(value) => setFilters(f => ({...f, period: value}))}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.granularity} onValueChange={(value) => setFilters(f => ({...f, granularity: value}))}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
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
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#10B981" name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="job_postings" stroke="#F59E0B" name="Job Postings" />
              <Line yAxisId="right" type="monotone" dataKey="applications" stroke="#3B82F6" name="Applications" />
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
    <Card>
      <CardHeader>
        <CardTitle>User Demographics</CardTitle>
        <CardDescription>Distribution of users by role</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle>Top Job Categories</CardTitle>
        <CardDescription>Top 10 active job categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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
  const [filters, setFilters] = useState({ period: '30d', granularity: 'daily' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both datasets in parallel
        const [revenueRes, usersRes] = await Promise.all([
          getRevenueTrends(filters),
          getUserGrowth(filters)
        ]);

        const revenueData = revenueRes.data;
        const usersData = usersRes.data;

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
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Platform Activity Overview</CardTitle>
              <CardDescription>Users, jobs, and applications trends</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filters.period} onValueChange={(value) => setFilters(f => ({...f, period: value}))}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.granularity} onValueChange={(value) => setFilters(f => ({...f, granularity: value}))}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
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
              <Line type="monotone" dataKey="users" name="New Users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="job_postings" stroke="#10B981" strokeWidth={2} name="Job Postings" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="applications" stroke="#F59E0B" strokeWidth={2} name="Applications" dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};