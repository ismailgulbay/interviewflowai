import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { apiClient } from '../../lib/api/client';
import type { UserRole } from '../../types/domain';

import { AuthContext, type AuthUser, type AuthContextValue } from './auth-context-store';

const STORAGE_KEY = 'interviewflow_admin_auth';

function readStoredAuth(): { user: AuthUser | null; token: string | null } {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { user: null, token: null };
  }

  try {
    const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
    return { user: parsed.user, token: parsed.token };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredAuth().user);
  const [token, setToken] = useState<string | null>(() => readStoredAuth().token);
  const [isLoading] = useState(false);

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
    }
  }, [token]);

  const login = useCallback(async (input: { email: string; role: UserRole }) => {
    const result = await apiClient.login(input);
    const nextUser = { email: result.user.email, role: result.user.role };
    setUser(nextUser);
    setToken(result.token);
    apiClient.setToken(result.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: result.token }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
