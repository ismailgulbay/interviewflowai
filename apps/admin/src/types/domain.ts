export type UserRole = 'admin' | 'interviewer' | 'candidate';

export interface UserItem {
  id: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

export interface QuestionItem {
  id: string;
  category: string;
  level: 'junior' | 'mid' | 'senior';
  prompt: string;
}

export interface SessionItem {
  id: string;
  candidate: string;
  interviewer: string;
  startedAt: string;
  status: 'scheduled' | 'running' | 'completed';
}

export interface EvaluationItem {
  id: string;
  sessionId: string;
  score: number;
  status: 'processing' | 'completed' | 'failed';
  updatedAt: string;
}

export interface FailedJobItem {
  id: string;
  type: string;
  reason: string;
  retryCount: number;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalUsers: number;
  activeSessions: number;
  avgEvaluationScore: number;
  failedJobRate: number;
}
