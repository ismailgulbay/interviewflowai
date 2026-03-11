import type {
  AnalyticsOverview,
  EvaluationItem,
  FailedJobItem,
  QuestionItem,
  SessionItem,
  UserItem,
} from '../../types/domain';

import {
  mockAnalytics,
  mockEvaluations,
  mockFailedJobs,
  mockQuestions,
  mockSessions,
  mockUsers,
} from './mock-data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';
const EVALUATIONS_SSE_URL =
  import.meta.env.VITE_EVALUATIONS_SSE_URL ?? 'http://localhost:4000/api/v1/events/evaluations';

export interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

function paginate<T>(items: T[], params: ListParams): ListResponse<T> {
  const search = params.search?.trim().toLowerCase();
  const filtered = search
    ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
    : items;
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
  };
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  getEvaluationsSSEUrl(): string {
    return EVALUATIONS_SSE_URL;
  }

  private async request<T>(path: string, init?: Parameters<typeof fetch>[1]): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...init?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const parsed = (await res.json()) as ApiResponse<T>;
    return parsed.data;
  }

  async login(input: { email: string; role: 'admin' | 'interviewer' | 'candidate' }) {
    const data = await this.request<{
      token: string;
      tokenType: string;
      expiresIn: string;
      user: { email: string; role: 'admin' | 'interviewer' | 'candidate' };
    }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    this.setToken(data.token);
    return data;
  }

  async getUsers(params: ListParams): Promise<ListResponse<UserItem>> {
    try {
      const data = await this.request<UserItem[]>('/v1/users');
      return paginate(data, params);
    } catch {
      return paginate(mockUsers, params);
    }
  }

  async getQuestions(params: ListParams): Promise<ListResponse<QuestionItem>> {
    return paginate(mockQuestions, params);
  }

  async getSessions(params: ListParams): Promise<ListResponse<SessionItem>> {
    return paginate(mockSessions, params);
  }

  async getEvaluations(params: ListParams): Promise<ListResponse<EvaluationItem>> {
    try {
      const data = await this.request<EvaluationItem[]>('/v1/evaluations');
      return paginate(data, params);
    } catch {
      return paginate(mockEvaluations, params);
    }
  }

  async getFailedJobs(params: ListParams): Promise<ListResponse<FailedJobItem>> {
    return paginate(mockFailedJobs, params);
  }

  async getAnalytics(): Promise<AnalyticsOverview> {
    try {
      return await this.request<AnalyticsOverview>('/v1/analytics/overview');
    } catch {
      return mockAnalytics;
    }
  }
}

export const apiClient = new ApiClient();
