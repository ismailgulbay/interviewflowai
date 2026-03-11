import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { DataTable } from '../components/ui/data-table';
import { FilterBar } from '../components/ui/filter-bar';
import { ListPageShell } from '../components/ui/list-page-shell';
import { Pagination } from '../components/ui/pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/states';
import { StatusBadge } from '../components/ui/status-badge';
import { apiClient, type ListResponse } from '../lib/api/client';
import { useListState } from '../lib/query/use-list-state';
import { useEvaluationSSE, type EvaluationStatusEvent } from '../lib/sse/use-evaluation-sse';
import type { EvaluationItem } from '../types/domain';

export function EvaluationsPage() {
  const state = useListState(10);
  const queryClient = useQueryClient();

  const query = useQuery<ListResponse<EvaluationItem>>({
    queryKey: ['evaluations', state.queryParams],
    queryFn: () => apiClient.getEvaluations(state.queryParams),
  });

  const onSseEvent = useCallback(
    (event: EvaluationStatusEvent) => {
      queryClient.setQueriesData(
        { queryKey: ['evaluations'] },
        (oldData: ListResponse<EvaluationItem> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === event.evaluationId
                ? {
                    ...item,
                    status: event.status,
                    score: event.score ?? item.score,
                    updatedAt: new Date().toISOString(),
                  }
                : item,
            ),
          };
        },
      );
    },
    [queryClient],
  );

  const sseState = useEvaluationSSE(onSseEvent);

  const table = (() => {
    if (query.isLoading) return <LoadingState label="Loading evaluations..." />;
    if (query.error) return <ErrorState message="Failed to fetch evaluations." />;
    if (!query.data || query.data.items.length === 0) return <EmptyState />;

    return (
      <>
        <DataTable<EvaluationItem>
          rows={query.data.items}
          columns={[
            { key: 'id', title: 'ID', render: (row) => row.id },
            { key: 'sessionId', title: 'Session', render: (row) => row.sessionId },
            { key: 'score', title: 'Score', render: (row) => row.score },
            { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            {
              key: 'updatedAt',
              title: 'Updated At',
              render: (row) => new Date(row.updatedAt).toLocaleString(),
            },
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
      title="Evaluations"
      subtitle={`Real-time updates via SSE: ${sseState}`}
      controls={
        <FilterBar
          search={state.search}
          onSearchChange={(value) => {
            state.setSearch(value);
            state.setPage(1);
          }}
          placeholder="Search by session, status, score..."
        />
      }
      table={table}
      pagination={null}
    />
  );
}
