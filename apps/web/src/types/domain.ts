export type UserRole = 'admin' | 'interviewer' | 'candidate';

export interface InterviewListItem {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'junior' | 'mid' | 'senior';
  questionCount: number;
}

export interface InterviewDetail {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'junior' | 'mid' | 'senior';
  questions: Array<{ id: string; prompt: string }>;
}

export interface SessionDetail {
  sessionId: string;
  interviewId: string;
  status: 'in_progress' | 'evaluation_pending' | 'completed';
  questions: Array<{ id: string; prompt: string }>;
  answers: Record<string, string>;
}

export interface SessionResult {
  sessionId: string;
  status: 'completed';
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}
