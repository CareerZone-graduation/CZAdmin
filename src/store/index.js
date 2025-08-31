import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: import.meta.env.NODE_ENV !== 'production',
});
