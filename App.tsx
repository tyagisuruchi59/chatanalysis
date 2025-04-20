import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

import LandingPage from './components/LandingPage';
import ChatAnalysisDashboard from './components/chatanalysisdashboard';
import LoginForm from "./components/login";
import { AuthProvider, AuthContext } from './context/AuthContext';
// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="19574995697-710ot2mo8etfvhvtq2d8m4bdgkb7m34d.apps.googleusercontent.com">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ChatAnalysisDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
