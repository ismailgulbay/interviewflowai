import { createContext } from 'react';

import type { UserRole } from '../../types/domain';

export interface AuthUser {
  email: string;
  role: UserRole;
}

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; role: UserRole }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
