import apiClient from './apiClient';

/**
 * Lấy profile công ty của người dùng hiện tại (recruiter).
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
 *     businessRegistrationUrl: string,
 *     representativeName: string,
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
export const getMyCompany = (axiosConfig) => apiClient.get('/companies/my-company',axiosConfig);

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
  apiClient.get(`/companies/${companyId}`);

/**
 * Cập nhật profile công ty của người dùng hiện tại (recruiter) bằng FormData.
 * @param {FormData} formData - FormData chứa companyData (JSON string) và các file nếu có.
 * @param {object} axiosConfig - Cấu hình Axios tùy chọn.
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const updateMyCompany = (formData, axiosConfig) =>
  apiClient.patch('/companies/my-company', formData, {
    ...axiosConfig,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

/**
 * Tạo mới một công ty với FormData.
 * @param {FormData} formData - FormData chứa companyData (JSON string) và businessRegistrationFile (file).
 * @param {object} axiosConfig - Cấu hình Axios tùy chọn.
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const createCompany = (formData, axiosConfig) =>
  apiClient.post('/companies', formData, {
    ...axiosConfig,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

/**
 * Cập nhật logo công ty.
 * @param {FormData} formData
 * @returns {Promise<import('axios').AxiosResponse<any>>}
 */
export const updateMyCompanyLogo = (formData,axiosConfig) =>
  apiClient.post('/companies/my-company/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...axiosConfig,
  });

// Admin APIs cho quản lý companies
export const getAllCompaniesForAdmin = async (params = {}) => {
  return await apiClient.get('/companies', { params })
}

export const updateCompanyStatus = async (companyId, status) => {
  return await apiClient.patch(`/admin/companies/${companyId}/status`, { status }, { showToast: true })
}

export const updateCompanyVerification = async (companyId, verified) => {
  return await apiClient.patch(`/admin/companies/${companyId}/verification`, { verified }, { showToast: true })
}
