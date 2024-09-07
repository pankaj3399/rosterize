import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);

  const login = (data) => {
    setAuthData(data.user);
    setLoading(false);
    localStorage.setItem('token', data.token);

  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('token');
    setLoading(false);

  };

  const setAuth = (data) => {
    setAuthData(data?.user);
    setLoading(false);
  
  }

  return (
    <AuthContext.Provider value={{ authData, login, logout, setAuth, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
