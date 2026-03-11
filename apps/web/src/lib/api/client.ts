import type {
  InterviewDetail,
  InterviewListItem,
  SessionDetail,
  SessionResult,
  UserRole,
} from '../../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
  }
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, init?: Parameters<typeof fetch>[1]): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...init?.headers,
      },
    });

    const payload = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      throw new ApiClientError(
        payload.error?.message ?? `HTTP ${response.status}`,
        response.status,
        payload.error?.code,
      );
    }

    return payload.data;
  }

  login(input: { email: string; role: UserRole }) {
    return this.request<{
      token: string;
      tokenType: string;
      expiresIn: string;
      user: { email: string; role: UserRole };
    }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  me() {
    return this.request<{ email: string; role: UserRole }>('/v1/auth/me');
  }

  getInterviews() {
    return this.request<InterviewListItem[]>('/v1/interviews');
  }

  getInterview(id: string) {
    return this.request<InterviewDetail>(`/v1/interviews/${id}`);
  }

  startInterview(id: string) {
    return this.request<{
      sessionId: string;
      interviewId: string;
      status: 'in_progress';
    }>(`/v1/interviews/${id}/start`, {
      method: 'POST',
    });
  }

  getSession(sessionId: string) {
    return this.request<SessionDetail>(`/v1/sessions/${sessionId}`);
  }

  saveAnswer(sessionId: string, input: { questionId: string; answer: string }) {
    return this.request<{ sessionId: string; status: string; answersCount: number }>(
      `/v1/sessions/${sessionId}/answers`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    );
  }

  submitSession(sessionId: string) {
    return this.request<{ sessionId: string; status: string }>(`/v1/sessions/${sessionId}/submit`, {
      method: 'POST',
    });
  }

  getSessionStatus(sessionId: string) {
    return this.request<{ sessionId: string; status: 'in_progress' | 'evaluation_pending' | 'completed' }>(
      `/v1/sessions/${sessionId}/status`,
    );
  }

  getSessionResult(sessionId: string) {
    return this.request<SessionResult>(`/v1/sessions/${sessionId}/result`);
  }
}

export const apiClient = new ApiClient();
