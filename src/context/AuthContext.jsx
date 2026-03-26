import React, { createContext, useState, useEffect, useContext } from 'react';
import { signIn, logout, getCurrentUser, getAuthToken } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    const savedToken = getAuthToken();

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const loginUser = async (login, password) => {
    const data = await signIn(login, password);
    setUser(data.visiteur);
    setToken(data.token);
    return data;
  };
  

  const logoutUser = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    loginUser,
    logoutUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);