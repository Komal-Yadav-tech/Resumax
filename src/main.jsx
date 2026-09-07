import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AdminProvider } from './context/AdminContext';
import { FeedbackProvider } from './context/FeedbackContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteConfigProvider>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <FeedbackProvider>
              <App />
            </FeedbackProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </SiteConfigProvider>
  </React.StrictMode>
);
