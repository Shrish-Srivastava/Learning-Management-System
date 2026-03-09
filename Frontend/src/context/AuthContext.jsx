import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyAuthPayload = useCallback((payload) => {
    localStorage.setItem("skillup_access_token", payload.accessToken);
    setUser(payload.user);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("skillup_access_token");
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("skillup_access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        try {
          const { data } = await api.post("/auth/refresh");
          applyAuthPayload(data);
        } catch {
          clearAuth();
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [applyAuthPayload, clearAuth]);

  const login = useCallback(async (values) => {
    const { data } = await api.post("/auth/login", values);
    applyAuthPayload(data);
    return data.user;
  }, [applyAuthPayload]);

  const register = useCallback(async (values) => {
    const { data } = await api.post("/auth/register", values);
    applyAuthPayload(data);
    return data.user;
  }, [applyAuthPayload]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const refreshProfile = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      login,
      logout,
      refreshProfile,
      register,
      setUser,
    }),
    [loading, login, logout, refreshProfile, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
