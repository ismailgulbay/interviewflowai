import { useState } from 'react';

export function useListState(initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [search, setSearch] = useState('');

  return {
    page,
    pageSize,
    search,
    setSearch,
    setPage,
    queryParams: { page, pageSize, search },
  };
}
