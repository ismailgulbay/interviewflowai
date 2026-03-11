import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AdminLayout } from '../components/layout/admin-layout';
import { AuthGuard } from '../features/auth/auth-guard';
import { AnalyticsPage } from '../pages/analytics-page';
import { DashboardPage } from '../pages/dashboard-page';
import { EvaluationsPage } from '../pages/evaluations-page';
import { FailedJobsPage } from '../pages/failed-jobs-page';
import { LoginPage } from '../pages/login-page';
import { QuestionsPage } from '../pages/questions-page';
import { SessionsPage } from '../pages/sessions-page';
import { UsersPage } from '../pages/users-page';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/users', element: <UsersPage /> },
          { path: '/questions', element: <QuestionsPage /> },
          { path: '/sessions', element: <SessionsPage /> },
          { path: '/evaluations', element: <EvaluationsPage /> },
          { path: '/failed-jobs', element: <FailedJobsPage /> },
          { path: '/analytics', element: <AnalyticsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
