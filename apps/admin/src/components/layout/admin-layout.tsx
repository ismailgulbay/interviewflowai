import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../../features/auth/use-auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/questions', label: 'Questions' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/evaluations', label: 'Evaluations' },
  { to: '/failed-jobs', label: 'Failed Jobs' },
  { to: '/analytics', label: 'Analytics' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>InterviewFlow</h1>
          <p>Admin Console</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="ghost-btn" onClick={logout} type="button">
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <h2>InterviewFlow AI</h2>
            <p>Technical interview preparation operations dashboard</p>
          </div>
          <div className="profile-chip">
            <span>{user?.email}</span>
            <strong>{user?.role}</strong>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
