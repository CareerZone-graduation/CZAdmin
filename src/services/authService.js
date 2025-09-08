import apiClient from './apiClient';

// refreshToken gửi cookie (withCredentials: true)
export const refreshToken = () => {

  return apiClient.post('/auth/refresh', null, { withCredentials: true });
};

export const logoutServer = () => {
  return apiClient.post('/auth/logout', null, { withCredentials: true });
};

/**
 * Login with email and password
 * @param {{ email: string, password: string }} credentials 
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     id: string,
 *     email: string,
 *     role: string,
 *     active: boolean,
 *     isEmailVerified: boolean,
 *     accessToken: string
 *   }
 * }>>}
 */
export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials, { withCredentials: true });
};


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
export const getMe = (axiosConfig = {}) => {
  return apiClient.get('/auth/me', { ...axiosConfig, withCredentials: true });
};

/**
 * Register a new user account
 * @param {{username: string, email: string, password: string, fullName: string, role: string}} userData
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const register = (userData) => apiClient.post('/auth/register', userData);

// Logout user by calling the logout API endpoint.
// The following curl command is used as reference:
// curl --location --request POST 'localhost:5000/api/auth/logout' \
// --header 'Authorization: Bearer <token>' \
// --header 'Cookie: refreshToken=<token>' \
// --data ''
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
