import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { LoadingPanel, ErrorPanel } from '../components/ui/state';
import { useAuth } from '../features/auth/use-auth';
import { apiClient } from '../lib/api/client';

export function DashboardPage() {
  const { user } = useAuth();
  const interviewsQuery = useQuery({
    queryKey: ['web-interviews-preview'],
    queryFn: () => apiClient.getInterviews(),
  });

  if (interviewsQuery.isLoading) return <LoadingPanel label="Loading dashboard..." />;
  if (interviewsQuery.error) return <ErrorPanel message="Could not load interviews." />;

  return (
    <section className="panel">
      <h2>Welcome, {user?.email}</h2>
      <p>You can continue with available interviews from the list below.</p>

      <div className="cards-grid">
        {(interviewsQuery.data ?? []).slice(0, 2).map((interview) => (
          <article key={interview.id} className="card">
            <h3>{interview.title}</h3>
            <p>{interview.description}</p>
            <p>
              {interview.durationMinutes} min · {interview.questionCount} questions
            </p>
            <Link to={`/interviews/${interview.id}`}>View Interview</Link>
          </article>
        ))}
      </div>

      <Link to="/interviews" className="inline-link">
        Go to all interviews
      </Link>
    </section>
  );
}
