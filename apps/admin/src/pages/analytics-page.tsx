import { useQuery } from '@tanstack/react-query';

import { JobsChart } from '../components/charts/jobs-chart';
import { ScoresChart } from '../components/charts/scores-chart';
import { KpiCard } from '../components/ui/kpi-card';
import { ErrorState, LoadingState } from '../components/ui/states';
import { apiClient } from '../lib/api/client';
import { mockEvaluations, mockFailedJobs } from '../lib/api/mock-data';

export function AnalyticsPage() {
  const query = useQuery({
    queryKey: ['analytics-page'],
    queryFn: () => apiClient.getAnalytics(),
  });

  if (query.isLoading) return <LoadingState label="Loading analytics..." />;
  if (query.error || !query.data) return <ErrorState message="Analytics is unavailable." />;

  const scoreBuckets = [
    { name: '60-69', score: mockEvaluations.filter((x) => x.score >= 60 && x.score < 70).length },
    { name: '70-79', score: mockEvaluations.filter((x) => x.score >= 70 && x.score < 80).length },
    { name: '80-89', score: mockEvaluations.filter((x) => x.score >= 80 && x.score < 90).length },
    { name: '90+', score: mockEvaluations.filter((x) => x.score >= 90).length },
  ];

  const failureBuckets = [
    { name: 'Validation', jobs: Math.floor(mockFailedJobs.length * 0.25) },
    { name: 'Timeout', jobs: Math.floor(mockFailedJobs.length * 0.4) },
    { name: 'Queue', jobs: Math.floor(mockFailedJobs.length * 0.2) },
    { name: 'Other', jobs: Math.floor(mockFailedJobs.length * 0.15) },
  ];

  return (
    <div className="dashboard-grid">
      <KpiCard title="Total Users" value={query.data.totalUsers} />
      <KpiCard title="Active Sessions" value={query.data.activeSessions} />
      <KpiCard title="Average Score" value={query.data.avgEvaluationScore} />
      <KpiCard title="Failed Job Rate" value={`${Math.round(query.data.failedJobRate * 100)}%`} />
      <ScoresChart data={scoreBuckets} />
      <JobsChart data={failureBuckets} />
    </div>
  );
}