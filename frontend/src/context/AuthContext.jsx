import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const EMPTY_AUTH = {
  token: null,
  id: null,
  name: null,
  email: null,
  roles: [],
  isAuthenticated: false,
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(EMPTY_AUTH);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          clearAuth();
        } else {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setAuth({
            token,
            id: userData.id || null,
            name: userData.name || null,
            email: userData.email || null,
            roles: userData.roles || [],
            isAuthenticated: true,
          });
        }
      } catch {
        clearAuth();
      }
    }
    setLoading(false);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(EMPTY_AUTH);
  };

  const login = (data) => {
    localStorage.setItem('token', data.token);
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      roles: data.roles || [],
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setAuth({ token: data.token, ...userData, isAuthenticated: true });
  };

  const logout = () => clearAuth();

  const hasRole = (role) => auth.roles.includes(role);
  const isClient = () => hasRole('CLIENT');
  const isSupplier = () => hasRole('SUPPLIER');
  const isSuperAdmin = () => hasRole('SUPERADMIN');

  return (
    <AuthContext.Provider value={{
      auth,
      user: auth.isAuthenticated ? auth : null,
      login,
      logout,
      loading,
      hasRole,
      isClient,
      isSupplier,
      isSuperAdmin,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
