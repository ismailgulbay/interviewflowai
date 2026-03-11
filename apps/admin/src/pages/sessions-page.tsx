import { StatusBadge } from '../components/ui/status-badge';
import { apiClient } from '../lib/api/client';
import type { SessionItem } from '../types/domain';

import { useListPage } from './use-list-page';

export function SessionsPage() {
  return useListPage<SessionItem>(
    'sessions',
    'Sessions',
    'Track interview sessions and runtime status.',
    (params) => apiClient.getSessions(params),
    [
      { key: 'id', title: 'ID', render: (row) => row.id },
      { key: 'candidate', title: 'Candidate', render: (row) => row.candidate },
      { key: 'interviewer', title: 'Interviewer', render: (row) => row.interviewer },
      { key: 'startedAt', title: 'Started At', render: (row) => new Date(row.startedAt).toLocaleString() },
      { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    ],
  );
}
