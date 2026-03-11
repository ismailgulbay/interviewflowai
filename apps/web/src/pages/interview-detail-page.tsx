import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorPanel, LoadingPanel } from '../components/ui/state';
import { apiClient } from '../lib/api/client';

export function InterviewDetailPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const detailQuery = useQuery({
    queryKey: ['web-interview', id],
    queryFn: () => apiClient.getInterview(id),
    enabled: Boolean(id),
  });

  const startMutation = useMutation({
    mutationFn: () => apiClient.startInterview(id),
    onSuccess: (result) => {
      navigate(`/sessions/${result.sessionId}`);
    },
  });

  if (detailQuery.isLoading) return <LoadingPanel label="Loading interview..." />;
  if (detailQuery.error || !detailQuery.data) return <ErrorPanel message="Interview not found." />;

  const interview = detailQuery.data;

  return (
    <section className="panel">
      <h2>{interview.title}</h2>
      <p>{interview.description}</p>
      <p>
        Duration: {interview.durationMinutes} min · Difficulty: {interview.difficulty}
      </p>

      <ol className="questions-list">
        {interview.questions.map((q) => (
          <li key={q.id}>{q.prompt}</li>
        ))}
      </ol>

      <button type="button" disabled={startMutation.isPending} onClick={() => startMutation.mutate()}>
        {startMutation.isPending ? 'Starting...' : 'Start Interview'}
      </button>
    </section>
  );
}
