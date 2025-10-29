import apiClient from './apiClient';

/**
 * Get users list with filters
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - User status (active, banned)
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @param {string} [params.search] - Search term
 * @param {string} [params.sort] - Sort field and direction (e.g. "-createdAt")
 * @param {string} [params.role] - User role (candidate, recruiter)
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   meta: {
 *     currentPage: number,
 *     totalPages: number,
 *     totalItems: number,
 *     limit: number
 *   },
 *   data: Array<{
 *     _id: string,
 *     email: string,
 *     role: string,
 *     active: boolean,
 *     createdAt: string,
 *     fullname: string
 *   }>
 * }>>}
 */
export const getUsers = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  const url = queryString ? `/admin/users?${queryString}` : '/admin/users';
  
  return apiClient.get(url);
};

/**
 * Get user detail by ID
 * @param {string} userId - User ID
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: Object
 * }>>}
 */
export const getUserDetail = (userId) => {
  return apiClient.get(`/admin/users/${userId}`);
};

/**
 * Update user status
 * @param {string} userId - User ID
 * @param {Object} statusData - Status data
 * @param {string} statusData.status - New status ('active' or 'banned')
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     email: string,
 *     role: string,
 *     active: boolean
 *   }
 * }>>}
 */
export const updateUserStatus = (userId, statusData) => {
  return apiClient.patch(`/admin/users/${userId}/status`, statusData);
};

/**
 * Get current user profile
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     id: string,
 *     email: string,
 *     role: string,
 *     name: string,
 *     company: string,
 *     active: boolean
 *   }
 * }>>}
 */

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     id: string,
 *     email: string,
 *     role: string,
 *     name: string,
 *     company: string,
 *     active: boolean
 *   }
 * }>>}
 */
export const getUserById = (userId) => apiClient.get(`/users/${userId}`);

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const updateProfile = (userData) => apiClient.put('/users/profile', userData);

/**
 * Change password
 * @param {{ currentPassword: string, newPassword: string }} passwords 
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const changePassword = (passwords) => apiClient.post('/users/change-password', passwords);
