import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('funverse_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('[AUTH] Token verification failed:', err.message);
      localStorage.removeItem('funverse_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('funverse_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const demoLogin = async (role = 'USER') => {
    const res = await api.post('/auth/demo-login', { role });
    localStorage.setItem('funverse_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    localStorage.setItem('funverse_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('funverse_token');
    setUser(null);
  };

  const updateWalletAndXp = (newBalance, newXp, newLevel) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        walletBalance: newBalance !== undefined ? newBalance : prev.walletBalance,
        xp: newXp !== undefined ? newXp : prev.xp,
        level: newLevel !== undefined ? newLevel : prev.level
      };
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      demoLogin,
      register,
      logout,
      refreshUser: fetchProfile,
      updateWalletAndXp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
