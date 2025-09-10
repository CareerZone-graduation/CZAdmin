import { createSlice } from '@reduxjs/toolkit';
import { login, logoutServer, getMe } from '../../services/authService';
import { saveAccessToken, clearAccessToken, getAccessToken } from '../../utils/token';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initializing: true, // Thêm trạng thái khởi tạo
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    initAuthComplete: (state) => {
      state.initializing = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, initAuthComplete } = authSlice.actions;

// Thunk action creators for async operations
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await login(credentials);
    if (response.data.success) {
      // **Role Check**
      if (response.data.data.role !== 'admin') {
        throw new Error('Access Denied: You do not have admin privileges.');
      }

      // Lưu accessToken vào localStorage
      saveAccessToken(response.data.data.accessToken);
      
      const user = {
        id: response.data.data.id,
        email: response.data.data.email,
        role: response.data.data.role,
        active: response.data.data.active,
        isEmailVerified: response.data.data.isEmailVerified,
      };
      dispatch(loginSuccess(user));
    } else {
      throw new Error(response.data.data.message || 'Login failed');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await logoutServer();
  } catch (error) {
    // Optionally handle logout API error
    console.error('Logout API error:', error);
  }
  clearAccessToken();
  dispatch(logout());
};

export const initAuth = () => async (dispatch) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    // Không có token, giữ trạng thái chưa đăng nhập
    dispatch(initAuthComplete());
    return Promise.resolve();
  }

  try {
    // Có token, thử lấy thông tin user
    const response = await getMe();

    if (response.data.success) {
      const userData = response.data.data;

      // **Role Check**
      if (userData.role !== 'admin') {
        // Token belongs to a non-admin user, treat as invalid
        clearAccessToken();
      } else {
        // Khôi phục trạng thái đăng nhập
        const user = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          company: userData.company,
          active: userData.active,
        };
        dispatch(loginSuccess(user));
      }
    } else {
      // Token không hợp lệ, xóa token
      clearAccessToken();
    }
  } catch (error) {
    // Token hết hạn hoặc không hợp lệ, xóa token
    console.error('Init auth error:', error);
    clearAccessToken();
  } finally {
    dispatch(initAuthComplete());
  }
};

export default authSlice.reducer;
