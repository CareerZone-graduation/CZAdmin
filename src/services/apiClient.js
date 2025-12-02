import axios from 'axios';
import { getAccessToken, saveAccessToken } from '../utils/token';
import { forcedLogout } from '../utils/auth';
import { refreshToken } from './authService';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: 15000,
  withCredentials: false, // KHÔNG gửi cookie mặc định
});

// ----- gắn Authorization -----
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// ----- Refresh Token Flow -----
let isRefreshing = false;
let queue = [];

function subscribeRefresh(cb) {
  queue.push(cb);
}
function publishRefresh(token) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

// forcedLogout được import từ utils/auth.js

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;

    // ----- Logic Refresh Token cho lỗi 401 -----
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeRefresh((token) => {
            if (!token) return reject(error);
            config.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(config));
          });
        });
      }

      isRefreshing = true;
      try {
        // Break the circular dependency by calling the refresh endpoint directly
        const refreshResponse = await refreshToken();

        const { accessToken } = refreshResponse.data.data;

        saveAccessToken(accessToken);

        publishRefresh(accessToken);

        config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(config);
      } catch (refreshErr) {
        publishRefresh(null);
        await forcedLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    //luôn show toast nếu có lỗi
    const errorMessage = response?.data?.message || error?.message || 'Đã có lỗi xảy ra';
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default apiClient;
