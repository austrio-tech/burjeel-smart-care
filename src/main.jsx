import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { ChatProvider } from './contexts/ChatContext';
import App from './App';
import './index.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <AlertProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AlertProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
