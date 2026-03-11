import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '../components/ui/app-layout';
import { AuthGuard } from '../features/auth/auth-guard';
import { DashboardPage } from '../pages/dashboard-page';
import { InterviewDetailPage } from '../pages/interview-detail-page';
import { InterviewsPage } from '../pages/interviews-page';
import { LoginPage } from '../pages/login-page';
import { ResultPage } from '../pages/result-page';
import { SessionPage } from '../pages/session-page';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/interviews', element: <InterviewsPage /> },
          { path: '/interviews/:id', element: <InterviewDetailPage /> },
          { path: '/sessions/:sessionId', element: <SessionPage /> },
          { path: '/sessions/:sessionId/result', element: <ResultPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
