import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { DataTable } from '../components/ui/data-table';
import { FilterBar } from '../components/ui/filter-bar';
import { ListPageShell } from '../components/ui/list-page-shell';
import { Pagination } from '../components/ui/pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/states';
import { useListState } from '../lib/query/use-list-state';

interface Column<T> {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
}

export function useListPage<T>(
  key: string,
  title: string,
  subtitle: string,
  loader: (params: { page: number; pageSize: number; search?: string }) => Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }>,
  columns: Column<T>[],
) {
  const state = useListState(10);
  const query = useQuery({
    queryKey: [key, state.queryParams],
    queryFn: () => loader(state.queryParams),
  });

  const content = (() => {
    if (query.isLoading) return <LoadingState label="Loading data..." />;
    if (query.error) return <ErrorState message="Failed to fetch records." />;
    if (!query.data || query.data.items.length === 0) return <EmptyState />;

    return (
      <>
        <DataTable rows={query.data.items} columns={columns} />
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
      title={title}
      subtitle={subtitle}
      controls={
        <FilterBar
          search={state.search}
          onSearchChange={(value) => {
            state.setSearch(value);
            state.setPage(1);
          }}
        />
      }
      table={content}
      pagination={null}
    />
  );
}
