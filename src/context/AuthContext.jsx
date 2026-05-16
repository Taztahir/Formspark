import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await authAPI.signup({ name, email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed';
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
