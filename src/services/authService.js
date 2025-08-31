import apiClient from './apiClient';

// refreshToken gửi cookie (withCredentials: true)
export const refreshToken = () =>
  apiClient.post('/auth/refresh', null, { withCredentials: true });

export const logoutServer = () =>
  apiClient.post('/auth/logout', null, { withCredentials: true });

/**
 * Login with username and password
 * @param {{ username: string, password: string }} credentials 
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     id: string,
 *     email: string,
 *     role: string,
 *     active: boolean,
 *     accessToken: string
 *   }
 * }>>}
 */
export const login = (credentials) =>
  apiClient.post('/auth/login', credentials, { withCredentials: true });


/**
 * Get current user profile
 * @param {Object} axiosConfig - Optional Axios config
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
export const getMe = (axiosConfig = {}) =>
  apiClient.get('/auth/me', { ...axiosConfig, withCredentials: true });

/**
 * Register a new user account
 * @param {{username: string, email: string, password: string, fullName: string, role: string}} userData
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const register = (userData) => apiClient.post('/auth/register', userData);
