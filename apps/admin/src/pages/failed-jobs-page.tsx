import { useQuery } from '@tanstack/react-query';

import { DataTable } from '../components/ui/data-table';
import { FilterBar } from '../components/ui/filter-bar';
import { ListPageShell } from '../components/ui/list-page-shell';
import { Pagination } from '../components/ui/pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/states';
import { apiClient, type ListResponse } from '../lib/api/client';
import { useListState } from '../lib/query/use-list-state';
import type { FailedJobItem } from '../types/domain';

export function FailedJobsPage() {
  const state = useListState(10);

  const query = useQuery<ListResponse<FailedJobItem>>({
    queryKey: ['failed-jobs', state.queryParams],
    queryFn: () => apiClient.getFailedJobs(state.queryParams),
  });

  const table = (() => {
    if (query.isLoading) return <LoadingState label="Loading failed jobs..." />;
    if (query.error) return <ErrorState message="Failed to fetch failed jobs." />;
    if (!query.data || query.data.items.length === 0) return <EmptyState />;

    return (
      <>
        <DataTable<FailedJobItem>
          rows={query.data.items}
          columns={[
            { key: 'id', title: 'Job ID', render: (row) => row.id },
            { key: 'type', title: 'Type', render: (row) => row.type },
            { key: 'reason', title: 'Reason', render: (row) => row.reason },
            { key: 'retryCount', title: 'Retries', render: (row) => row.retryCount },
            { key: 'createdAt', title: 'Created At', render: (row) => new Date(row.createdAt).toLocaleString() },
          ]}
        />
        <Pagination
          page={state.page}
          pageSize={state.pageSize}
          total={query.data.total}
          onPageChange={state.setPage}
        />
      </>
    );
  })();

  return (
    <ListPageShell
      title="Failed Jobs"
      subtitle="Observe and debug jobs that exhausted retries."
      controls={
        <FilterBar
          search={state.search}
          onSearchChange={(value) => {
            state.setSearch(value);
            state.setPage(1);
          }}
          placeholder="Search reason or job id..."
        />
      }
      table={table}
      pagination={null}
    />
  );
}
