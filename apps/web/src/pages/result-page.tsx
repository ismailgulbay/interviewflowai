import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { ErrorPanel, LoadingPanel } from '../components/ui/state';
import { apiClient } from '../lib/api/client';

export function ResultPage() {
  const { sessionId = '' } = useParams();

  const statusQuery = useQuery({
    queryKey: ['web-result-status', sessionId],
    queryFn: () => apiClient.getSessionStatus(sessionId),
    enabled: Boolean(sessionId),
    refetchInterval: (query) => (query.state.data?.status === 'completed' ? false : 2000),
  });

  const resultQuery = useQuery({
    queryKey: ['web-result', sessionId],
    queryFn: () => apiClient.getSessionResult(sessionId),
    enabled: statusQuery.data?.status === 'completed',
  });

  if (statusQuery.isLoading) return <LoadingPanel label="Checking evaluation status..." />;
  if (statusQuery.error) return <ErrorPanel message="Failed to load result status." />;

  if (statusQuery.data?.status !== 'completed') {
    return (
      <section className="panel pending-panel">
        <h2>Evaluation pending</h2>
        <p>Your evaluation is still being processed. This page refreshes automatically.</p>
      </section>
    );
  }

  if (resultQuery.isLoading) return <LoadingPanel label="Loading result..." />;
  if (resultQuery.error || !resultQuery.data) return <ErrorPanel message="Result could not be loaded." />;

  const result = resultQuery.data;

  return (
    <section className="panel result-panel">
      <h2>Your Interview Result</h2>
      <p className="score">{result.score}</p>
      <p>{result.feedback}</p>

      <div className="cards-grid">
        <article className="card">
          <h3>Strengths</h3>
          <ul>
            {result.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Improvements</h3>
          <ul>
            {result.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
