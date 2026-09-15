import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminApp: React.FC = () => {
  // Estado local temporário para a sessão do admin
  // Em uma aplicação real, isso checaria um token JWT no localStorage/cookies
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    navigate('/admin');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#16171d', color: '#f3f4f6', margin: 0, padding: 0 }}>
      <Routes>
        <Route 
          path="/" 
          element={
            isAdminLoggedIn ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAdminLoggedIn ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
};
