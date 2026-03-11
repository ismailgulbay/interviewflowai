import { apiClient } from '../lib/api/client';
import type { QuestionItem } from '../types/domain';

import { useListPage } from './use-list-page';

export function QuestionsPage() {
  return useListPage<QuestionItem>(
    'questions',
    'Questions',
    'Question bank with category and level metadata.',
    (params) => apiClient.getQuestions(params),
    [
      { key: 'id', title: 'ID', render: (row) => row.id },
      { key: 'category', title: 'Category', render: (row) => row.category },
      { key: 'level', title: 'Level', render: (row) => row.level },
      { key: 'prompt', title: 'Prompt', render: (row) => row.prompt },
    ],
  );
}
