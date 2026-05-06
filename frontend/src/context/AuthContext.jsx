import { createContext, useEffect, useMemo, useState } from "react";

import { loginApi, meApi, signupApi } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("ttm_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await meApi();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem("ttm_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    localStorage.setItem("ttm_token", response.token);
    setUser(response.user);
    return response;
  };

  const signup = async (payload) => {
    const response = await signupApi(payload);
    localStorage.setItem("ttm_token", response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
