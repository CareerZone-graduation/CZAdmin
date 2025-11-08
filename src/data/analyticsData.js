// Mock analytics data for enhanced dashboard
import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Generate realistic mock data
const generateDailyData = (days = 30) => {
  const end = new Date();
  const start = subDays(end, days - 1);
  
  return eachDayOfInterval({ start, end }).map((date, index) => ({
    date: format(date, 'MMM dd'),
    fullDate: date,
    users: Math.floor(Math.random() * 50) + 20 + index * 2,
    jobs: Math.floor(Math.random() * 20) + 5 + Math.floor(index / 3),
    companies: Math.floor(Math.random() * 10) + 2 + Math.floor(index / 5),
    revenue: Math.floor(Math.random() * 2000) + 500 + index * 30,
    applications: Math.floor(Math.random() * 100) + 30 + index * 3,
    views: Math.floor(Math.random() * 500) + 200 + index * 10
  }));
};

// User growth by role
export const userGrowthData = generateDailyData(30);

// Job posting trends
export const jobTrendsData = generateDailyData(30);

// Revenue analytics
export const revenueData = generateDailyData(30);

// Company registration data
export const companyData = generateDailyData(30);

// User demographics
export const userDemographics = [
  { name: 'Job Seekers', value: 1843, color: '#3B82F6' },
  { name: 'Recruiters', value: 567, color: '#10B981' },
  { name: 'Company Admins', value: 133, color: '#F59E0B' }
];

// Job categories distribution
export const jobCategories = [
  { name: 'Technology', value: 342, color: '#6366F1' },
  { name: 'Marketing', value: 156, color: '#EC4899' },
  { name: 'Sales', value: 123, color: '#F59E0B' },
  { name: 'Design', value: 98, color: '#10B981' },
  { name: 'Finance', value: 87, color: '#EF4444' },
  { name: 'Others', value: 50, color: '#8B5CF6' }
];

// Monthly performance metrics
export const monthlyMetrics = {
  currentMonth: {
    users: 2543,
    companies: 187,
    jobs: 856,
    revenue: 24780,
    applications: 12340,
    interviews: 3456
  },
  previousMonth: {
    users: 2271,
    companies: 178,
    jobs: 725,
    revenue: 20150,
    applications: 10890,
    interviews: 2987
  },
  growth: {
    users: 12,
    companies: 5,
    jobs: 18,
    revenue: 23,
    applications: 13,
    interviews: 16
  }
};


// System health metrics
export const systemHealth = {
  uptime: '99.9%',
  responseTime: '145ms',
  activeUsers: 1834,
  serverLoad: 65,
  databaseHealth: 'excellent',
  apiCalls: 45678,
  errorRate: 0.1
};

// Traffic sources
export const trafficSources = [
  { name: 'Direct', value: 45, color: '#3B82F6' },
  { name: 'Search Engines', value: 30, color: '#10B981' },
  { name: 'Social Media', value: 15, color: '#F59E0B' },
  { name: 'Referrals', value: 10, color: '#EF4444' }
];


// Key performance indicators
export const kpiData = [
  {
    title: 'Application Success Rate',
    value: '23.5%',
    change: '+2.1%',
    trend: 'up',
    description: 'Percentage of applications leading to interviews'
  },
  {
    title: 'Average Time to Hire',
    value: '14 days',
    change: '-3 days',
    trend: 'up',
    description: 'Average time from posting to hiring'
  },
  {
    title: 'User Engagement',
    value: '78%',
    change: '+5%',
    trend: 'up',
    description: 'Active users in the last 30 days'
  },
  {
    title: 'Platform Revenue',
    value: '24.7 triệu VNĐ',
    change: '+23%',
    trend: 'up',
    description: 'Monthly recurring revenue'
  }
];