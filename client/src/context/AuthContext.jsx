/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Fix 4: Check auth status via cookie
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      // Registration no longer auto-logs in. It returns success message to check email.
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const googleLogin = async (code) => {
    try {
      const { data } = await api.post('/auth/google', { code });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Google login failed' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.patch('/auth/profile', profileData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Profile update failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
