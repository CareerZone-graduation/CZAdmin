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

/**
 * GET /api/analytics/transaction-trends
 * Fetches transaction trend analytics data with filters.
 * @param {object} params - Query parameters (period, granularity)
 * @example { period: '7d', granularity: 'daily' }
 */
export const getTransactionTrends = (params) => {
  return apiClient.get('/analytics/transaction-trends', { params });
};

/**
 * GET /api/analytics/transaction-today
 * Fetches today's transaction statistics.
 */
export const getTransactionToday = () => {
  return apiClient.get('/analytics/transaction-today');
};

/**
 * GET /api/analytics/top-spending-users
 * Fetches list of top spending users.
 * @param {object} params - Query parameters (limit)
 * @example { limit: 10 }
 */
export const getTopSpendingUsers = (params = {}) => {
  return apiClient.get('/analytics/top-spending-users', { params });
};

/**
 * GET /api/analytics/transactions
 * Fetches paginated transaction list with filters.
 * @param {object} params - Query parameters (page, limit, search, paymentMethod, startDate, endDate, status, sort)
 */
export const getTransactionsList = (params) => {
  return apiClient.get('/analytics/transactions', { params });
};

/**
 * GET /api/analytics/kpi-metrics
 * Fetches KPI business metrics from real MongoDB data.
 */
export const getKPIMetrics = () => {
  return apiClient.get('/analytics/kpi-metrics');
};