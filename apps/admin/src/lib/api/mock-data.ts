import type {
  AnalyticsOverview,
  EvaluationItem,
  FailedJobItem,
  QuestionItem,
  SessionItem,
  UserItem,
} from '../../types/domain';

export const mockUsers: UserItem[] = Array.from({ length: 42 }).map((_, i) => ({
  id: `u_${i + 1}`,
  email: `user${i + 1}@interviewflow.ai`,
  role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'interviewer' : 'candidate',
  status: i % 5 === 0 ? 'inactive' : 'active',
}));

export const mockQuestions: QuestionItem[] = Array.from({ length: 36 }).map((_, i) => ({
  id: `q_${i + 1}`,
  category: ['Algorithms', 'System Design', 'JavaScript', 'Node.js'][i % 4],
  level: i % 3 === 0 ? 'senior' : i % 3 === 1 ? 'mid' : 'junior',
  prompt: `Question ${i + 1}: Explain trade-offs for scenario ${i + 1}.`,
}));

export const mockSessions: SessionItem[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `s_${i + 1}`,
  candidate: `candidate${i + 1}@mail.com`,
  interviewer: `interviewer${(i % 8) + 1}@mail.com`,
  startedAt: new Date(Date.now() - i * 3_600_000).toISOString(),
  status: i % 4 === 0 ? 'scheduled' : i % 4 === 1 ? 'running' : 'completed',
}));

export const mockEvaluations: EvaluationItem[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `e_${i + 1}`,
  sessionId: `s_${(i % 24) + 1}`,
  score: 55 + (i % 40),
  status: i % 6 === 0 ? 'failed' : i % 5 === 0 ? 'processing' : 'completed',
  updatedAt: new Date(Date.now() - i * 2_700_000).toISOString(),
}));

export const mockFailedJobs: FailedJobItem[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `fj_${i + 1}`,
  type: 'evaluation',
  reason: i % 2 === 0 ? 'Provider timeout' : 'Invalid transcript payload',
  retryCount: (i % 4) + 1,
  createdAt: new Date(Date.now() - i * 7_200_000).toISOString(),
}));

export const mockAnalytics: AnalyticsOverview = {
  totalUsers: mockUsers.length,
  activeSessions: mockSessions.filter((x) => x.status === 'running').length,
  avgEvaluationScore: Math.round(
    mockEvaluations.reduce((sum, item) => sum + item.score, 0) / mockEvaluations.length,
  ),
  failedJobRate: Number((mockFailedJobs.length / (mockEvaluations.length + mockFailedJobs.length)).toFixed(2)),
};
