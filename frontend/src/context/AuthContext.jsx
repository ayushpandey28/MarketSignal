import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AUTH_KEYS = ['ms_token', 'token'];
const AuthContext = createContext(null);

function readStoredToken() {
  return AUTH_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) || '';
}

function saveStoredToken(token) {
  AUTH_KEYS.forEach((key) => localStorage.setItem(key, token));
}

function clearStoredToken() {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = readStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((res) => setUser(res.data))
      .catch(() => {
        clearStoredToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (payload) => {
        const res = await authService.login(payload);
        saveStoredToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      register: async (payload) => {
        const res = await authService.register(payload);
        saveStoredToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      logout: () => {
        clearStoredToken();
        setUser(null);
      },
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
