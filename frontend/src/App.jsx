import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductCatalog from './pages/ProductCatalog';
import CartPage from './pages/CartPage';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import SupplierDashboard from './pages/SupplierDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Navigate to="/shop" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/shop" element={<ProductCatalog />} />

              {/* Client Routes */}
              <Route path="/cart" element={
                <ProtectedRoute roles={['CLIENT']}>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute roles={['CLIENT']}>
                  <OrderHistory />
                </ProtectedRoute>
              } />

              {/* Superadmin Routes */}
              <Route path="/admin/dashboard" element={<Navigate to="/superadmin/users" replace />} />
              
              <Route path="/superadmin/users" element={
                <ProtectedRoute roles={['SUPERADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } />

              {/* Supplier Dashboard */}
              <Route path="/supplier/dashboard" element={
                <ProtectedRoute roles={['SUPPLIER', 'SUPERADMIN']}>
                  <SupplierDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
