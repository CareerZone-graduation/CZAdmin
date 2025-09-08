import apiClient from './apiClient';

/**
 * GET /api/analytics/dashboard-stats
 * Fetches the main KPI stats for the dashboard.
 */
export const getDashboardStats = () => {
  return apiClient.get('/analytics/dashboard-stats');
};

/**
 * GET /api/analytics/user-growth
 * Fetches user growth data over a specified period.
 * @param {object} params - Query parameters (period, granularity)
 * @example { period: '30d', granularity: 'daily' }
 */
export const getUserGrowth = (params) => {
  return apiClient.get('/analytics/user-growth', { params });
};

/**
 * GET /api/analytics/revenue-trends
 * Fetches revenue trend data over a specified period.
 * @param {object} params - Query parameters (period, granularity)
 * @example { period: '30d', granularity: 'daily' }
 */
export const getRevenueTrends = (params) => {
  return apiClient.get('/analytics/revenue-trends', { params });
};

/**
 * GET /api/analytics/user-demographics
 * Fetches the distribution of users by role.
 */
export const getUserDemographics = () => {
  return apiClient.get('/analytics/user-demographics');
};

/**
 * GET /api/analytics/job-categories
 * Fetches the distribution of jobs by category.
 */
export const getJobCategories = () => {
  return apiClient.get('/analytics/job-categories');
};