import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './store'; // Import store
import { Toaster } from 'sonner';
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}> {/* Bọc App bằng Provider */}
      <App />
      <Toaster richColors position="top-right" />
    </Provider>
  // </React.StrictMode>
);
