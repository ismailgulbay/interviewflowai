import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { ErrorPanel, LoadingPanel } from '../components/ui/state';
import { apiClient } from '../lib/api/client';

export function InterviewsPage() {
  const query = useQuery({
    queryKey: ['web-interviews'],
    queryFn: () => apiClient.getInterviews(),
  });

  if (query.isLoading) return <LoadingPanel label="Loading interviews..." />;
  if (query.error) return <ErrorPanel message="Could not fetch interviews." />;

  return (
    <section className="panel">
      <h2>Interviews</h2>
      <div className="cards-grid">
        {(query.data ?? []).map((item) => (
          <article key={item.id} className="card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="meta-row">
              <span>{item.durationMinutes} min</span>
              <span>{item.questionCount} questions</span>
              <span>{item.difficulty}</span>
            </div>
            <Link to={`/interviews/${item.id}`}>Open</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
