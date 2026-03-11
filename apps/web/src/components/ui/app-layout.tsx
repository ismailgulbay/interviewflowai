import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../../features/auth/use-auth';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="web-shell">
      <header className="web-header">
        <Link to="/dashboard" className="brand-link">
          InterviewFlow Candidate
        </Link>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/interviews">Interviews</NavLink>
        </nav>

        <div className="header-user">
          <span>{user?.email}</span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="web-main">
        <Outlet />
      </main>
    </div>
  );
}
