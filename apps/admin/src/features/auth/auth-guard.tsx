import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from './use-auth';

export function AuthGuard() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="center-state">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
