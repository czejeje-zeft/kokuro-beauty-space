// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/admin';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // checking token on mount

  // On mount: validate stored token
  useEffect(() => {
    const token = localStorage.getItem('kokuro_admin_token');
    if (!token) { setLoading(false); return; }

    adminApi.me()
      .then(res => { if (res.success) setUser(res.user); })
      .catch(() => localStorage.removeItem('kokuro_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await adminApi.login(email, password);
    if (!res.success) throw new Error(res.message ?? 'Login gagal.');
    localStorage.setItem('kokuro_admin_token', res.token);
    setUser(res.user);
    return res;
  }

  async function logout() {
    await adminApi.logout().catch(() => {});
    localStorage.removeItem('kokuro_admin_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
