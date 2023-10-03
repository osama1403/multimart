import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";
import { AuthProvider } from './Context/AuthContext'
import { PrivateAxiosProvider } from './Context/PrivateAxiosContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ScrollToTopOnNavigate />
    <AuthProvider>
      <PrivateAxiosProvider>
        <App />
      </PrivateAxiosProvider>
    </AuthProvider>
  </BrowserRouter>
  //  </React.StrictMode>
);

