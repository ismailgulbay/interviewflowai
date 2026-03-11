import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { apiClient } from '../../lib/api/client';
import type { UserRole } from '../../types/domain';

import { AuthContext, type AuthContextValue, type AuthUser } from './auth-context-store';

const STORAGE_KEY = 'interviewflow_web_auth';

function readStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { token: null as string | null, user: null as AuthUser | null };
  }
  try {
    return JSON.parse(raw) as { token: string; user: AuthUser };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const initial = readStorage();
  const [token, setToken] = useState<string | null>(initial.token);
  const [user, setUser] = useState<AuthUser | null>(initial.user);
  const [isLoading, setIsLoading] = useState(Boolean(initial.token));

  useEffect(() => {
    if (!token) {
      return;
    }

    apiClient.setToken(token);
    void apiClient
      .me()
      .then((profile) => {
        setUser({ email: profile.email, role: profile.role });
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setToken(null);
        apiClient.setToken(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const login = useCallback(async (input: { email: string; role: UserRole }) => {
    const result = await apiClient.login(input);
    apiClient.setToken(result.token);

    const nextUser = { email: result.user.email, role: result.user.role };
    setToken(result.token);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: result.token, user: nextUser }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    apiClient.setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
