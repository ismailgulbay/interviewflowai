import { useQuery } from '@tanstack/react-query';

import { JobsChart } from '../components/charts/jobs-chart';
import { ScoresChart } from '../components/charts/scores-chart';
import { KpiCard } from '../components/ui/kpi-card';
import { ErrorState, LoadingState } from '../components/ui/states';
import { apiClient } from '../lib/api/client';
import { mockEvaluations, mockFailedJobs } from '../lib/api/mock-data';

function toScoreSeries() {
  return mockEvaluations.slice(0, 8).map((item, i) => ({
    name: `T${i + 1}`,
    score: item.score,
  }));
}

function toJobSeries() {
  return [
    { name: '0-6h', jobs: mockFailedJobs.slice(0, 3).length },
    { name: '6-12h', jobs: mockFailedJobs.slice(3, 7).length },
    { name: '12-24h', jobs: mockFailedJobs.slice(7, 12).length },
    { name: '24h+', jobs: mockFailedJobs.slice(12).length },
  ];
}

export function DashboardPage() {
  const analyticsQuery = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => apiClient.getAnalytics(),
  });

  if (analyticsQuery.isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (analyticsQuery.error || !analyticsQuery.data) {
    return <ErrorState message="Dashboard data could not be loaded." />;
  }

  const analytics = analyticsQuery.data;

  return (
    <div className="dashboard-grid">
      <KpiCard title="Total Users" value={analytics.totalUsers} subtitle="Registered accounts" />
      <KpiCard
        title="Active Sessions"
        value={analytics.activeSessions}
        subtitle="Currently running interviews"
      />
      <KpiCard
        title="Avg Score"
        value={analytics.avgEvaluationScore}
        subtitle="Recent evaluation average"
      />
      <KpiCard
        title="Failed Job Rate"
        value={`${Math.round(analytics.failedJobRate * 100)}%`}
        subtitle="Worker reliability signal"
      />
      <ScoresChart data={toScoreSeries()} />
      <JobsChart data={toJobSeries()} />
    </div>
  );
}
