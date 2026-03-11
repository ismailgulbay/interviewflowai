import { StatusBadge } from '../components/ui/status-badge';
import { apiClient } from '../lib/api/client';
import type { UserItem } from '../types/domain';

import { useListPage } from './use-list-page';

export function UsersPage() {
  return useListPage<UserItem>(
    'users',
    'Users',
    'Manage platform access and roles.',
    (params) => apiClient.getUsers(params),
    [
      { key: 'id', title: 'ID', render: (row) => row.id },
      { key: 'email', title: 'Email', render: (row) => row.email },
      { key: 'role', title: 'Role', render: (row) => row.role },
      { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    ],
  );
}
