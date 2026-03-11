import { randomUUID } from 'node:crypto';

type SessionStatus = 'in_progress' | 'evaluation_pending' | 'completed';

interface InterviewQuestion {
  id: string;
  prompt: string;
}

export interface InterviewSeed {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'junior' | 'mid' | 'senior';
  questions: InterviewQuestion[];
}

export interface InterviewSession {
  sessionId: string;
  interviewId: string;
  candidateEmail: string;
  status: SessionStatus;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, string>;
  result?: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

const interviews: InterviewSeed[] = [
  {
    id: 'int_1',
    title: 'Backend System Design',
    description: 'Design reliable backend services with trade-off analysis.',
    durationMinutes: 45,
    difficulty: 'senior',
    questions: [
      { id: 'q_1', prompt: 'How would you design a rate-limited API gateway?' },
      { id: 'q_2', prompt: 'How do you scale a read-heavy service?' },
      { id: 'q_3', prompt: 'What consistency model would you choose and why?' },
    ],
  },
  {
    id: 'int_2',
    title: 'Node.js Fundamentals',
    description: 'Core runtime behavior, async flow, and API design.',
    durationMinutes: 30,
    difficulty: 'mid',
    questions: [
      { id: 'q_4', prompt: 'Explain event loop phases in Node.js.' },
      { id: 'q_5', prompt: 'How do you handle graceful shutdown in Express?' },
      { id: 'q_6', prompt: 'When do you choose worker threads?' },
    ],
  },
];

const sessions = new Map<string, InterviewSession>();

function buildResult(answerCount: number) {
  const score = Math.max(55, Math.min(95, 60 + answerCount * 12));
  return {
    score,
    feedback:
      'Mock evaluation completed. Candidate provided structured answers and reasonable technical trade-offs.',
    strengths: ['Problem decomposition', 'Clear communication'],
    improvements: ['Discuss edge cases earlier', 'Quantify scaling assumptions'],
  };
}

export function listInterviews() {
  return interviews.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    durationMinutes: item.durationMinutes,
    difficulty: item.difficulty,
    questionCount: item.questions.length,
  }));
}

export function getInterviewById(id: string) {
  const interview = interviews.find((item) => item.id === id);
  return interview ?? null;
}

export function createSession(interviewId: string, candidateEmail: string) {
  const sessionId = `sess_${randomUUID().replaceAll('-', '').slice(0, 12)}`;

  const session: InterviewSession = {
    sessionId,
    interviewId,
    candidateEmail,
    status: 'in_progress',
    startedAt: new Date().toISOString(),
    answers: {},
  };

  sessions.set(sessionId, session);
  return session;
}

export function getSessionById(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function saveAnswer(sessionId: string, questionId: string, answer: string) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  session.answers[questionId] = answer;
  sessions.set(sessionId, session);
  return session;
}

export function submitSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'evaluation_pending';
  session.submittedAt = new Date().toISOString();
  sessions.set(sessionId, session);

  setTimeout(() => {
    const current = sessions.get(sessionId);
    if (!current || current.status !== 'evaluation_pending') {
      return;
    }

    current.status = 'completed';
    current.result = buildResult(Object.keys(current.answers).length);
    sessions.set(sessionId, current);
  }, 3500);

  return session;
}
