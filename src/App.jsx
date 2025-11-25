import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { initAuth } from './features/auth/authSlice';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const initCalled = useRef(false);

  useEffect(() => {
    if (!initCalled.current) {
        initCalled.current = true;
        dispatch(initAuth());
    }
  }, [dispatch]);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <AppRouter />
            <Toaster richColors position="top-right" />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
} 

export default App;