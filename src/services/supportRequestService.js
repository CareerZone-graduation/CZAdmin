import apiClient from './apiClient';

/**
 * Get all support requests with filters, sort, and pagination
 * @param {Object} filters - Filter options
 * @param {Object} sort - Sort options
 * @param {Object} pagination - Pagination options
 * @returns {Promise} API response
 */
export const getAllSupportRequests = async (filters = {}, sort = {}, pagination = {}) => {
  const params = new URLSearchParams();
  
  // Filters
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.userType) params.append('userType', filters.userType);
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.fromDate) params.append('fromDate', filters.fromDate);
  if (filters.toDate) params.append('toDate', filters.toDate);
  
  // Sort
  if (sort.sortBy) params.append('sortBy', sort.sortBy);
  
  // Pagination
  if (pagination.page) params.append('page', pagination.page);
  if (pagination.limit) params.append('limit', pagination.limit);
  
  const response = await apiClient.get('/admin/support-requests', { params });
  return response.data;
};

/**
 * Get support request by ID
 * @param {string} id - Support request ID
 * @returns {Promise} API response
 */
export const getSupportRequestById = async (id) => {
  const response = await apiClient.get(`/admin/support-requests/${id}`);
  return response.data;
};

/**
 * Respond to support request
 * @param {string} id - Support request ID
 * @param {string} response - Response content
 * @param {string} statusUpdate - Optional status update
 * @param {string} priorityUpdate - Optional priority update
 * @returns {Promise} API response
 */
export const respondToRequest = async (id, response, statusUpdate = null, priorityUpdate = null) => {
  const data = { response };
  
  if (statusUpdate) data.statusUpdate = statusUpdate;
  if (priorityUpdate) data.priorityUpdate = priorityUpdate;
  
  const apiResponse = await apiClient.post(`/admin/support-requests/${id}/respond`, data);
  return apiResponse.data;
};

/**
 * Update support request status
 * @param {string} id - Support request ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/support-requests/${id}/status`, { status });
  return response.data;
};

/**
 * Update support request priority
 * @param {string} id - Support request ID
 * @param {string} priority - New priority
 * @returns {Promise} API response
 */
export const updatePriority = async (id, priority) => {
  const response = await apiClient.patch(`/admin/support-requests/${id}/priority`, { priority });
  return response.data;
};

/**
 * Reopen closed support request
 * @param {string} id - Support request ID
 * @returns {Promise} API response
 */
export const reopenRequest = async (id) => {
  const response = await apiClient.post(`/admin/support-requests/${id}/reopen`);
  return response.data;
};

/**
 * Get support request analytics
 * @param {Object} dateRange - Date range filter (fromDate, toDate)
 * @returns {Promise} API response
 */
export const getAnalytics = async (dateRange = {}) => {
  const params = new URLSearchParams();
  
  if (dateRange.fromDate) params.append('fromDate', dateRange.fromDate);
  if (dateRange.toDate) params.append('toDate', dateRange.toDate);
  
  const response = await apiClient.get('/admin/support-requests/analytics', { params });
  return response.data;
};
