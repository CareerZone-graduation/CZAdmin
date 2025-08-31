import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { initAuth } from './features/auth/authSlice';

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
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <AppRouter />
          <Toaster richColors position="top-right" />
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
} 

export default App;