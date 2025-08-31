import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Thunk action creators for async operations
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials check
    if (credentials.email === 'admin@careerzone.com' && credentials.password === 'admin123') {
      const user = {
        id: 1,
        email: credentials.email,
        name: 'Admin User',
        role: 'admin',
      };
      dispatch(loginSuccess(user));
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  // Clear any stored tokens/session data here
  dispatch(logout());
};

export const initAuth = () => (dispatch) => {
  // Check for existing session/token here
  // For now, just return - no persistent auth
  return Promise.resolve();
};

export default authSlice.reducer;
