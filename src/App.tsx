import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { HomePage } from './pages/HomePage';
import { OrderPage } from './pages/OrderPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ContentProvider>
          <Routes>
            {/* Public Pages (Exactly Two Main Pages) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderPage />} />

            {/* Admin Management Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ContentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
