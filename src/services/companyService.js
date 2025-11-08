import apiClient from './apiClient';

/**
 * Lấy profile công ty theo ID.
 * @param {string} companyId
 * @returns {Promise<import('axios').AxiosResponse<{
 *   success: boolean,
 *   message: string,
 *   data: {
 *     _id: string,
 *     name: string,
 *     about: string,
 *     industry: string,
 *     size: string,
 *     website: string,
 *     logo: string,
 *     verified: boolean,
 *     taxCode: string,
 *     createdAt: string,
 *     updatedAt: string,
 *     address: {
 *       street: string,
 *       city: string,
 *       country: string
 *     },
 *     contactInfo: {
 *       email: string,
 *       phone: string
 *     }
 *   }
 * }>>}
 */
export const getCompanyProfile = (companyId) =>
  apiClient.get(`/admin/companies/${companyId}`);


// Admin APIs cho quản lý companies
export const getAllCompaniesForAdmin = async (params = {}) => {
  return await apiClient.get('/admin/companies', { params })
}

export const approveCompany = async (companyId) => {
  return await apiClient.patch(`/admin/companies/${companyId}/approve`, {});
}

export const rejectCompany = async (companyId, rejectReason) => {
  return await apiClient.patch(`/admin/companies/${companyId}/reject`, { rejectReason });
}


/**
 * Lấy tất cả thống kê cho dashboard và các trang quản lý.
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const getSystemStats = () => {
  return apiClient.get('/admin/stats'); // Endpoint backend đã có
};

/**
 * Lấy thống kê công ty (total, pending, approved, rejected, verified).
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const getCompanyStats = () => {
  return apiClient.get('/analytics/company-stats');
};

/**
 * Lấy danh sách jobs của công ty
 * @param {string} companyId - Company ID (RecruiterProfile ID)
 * @param {Object} params - Query parameters
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const getCompanyJobs = async (companyId, params = {}) => {
  return await apiClient.get(`/admin/companies/${companyId}/jobs`, { params });
};
