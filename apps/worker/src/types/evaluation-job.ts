export interface EvaluationJobPayload {
  jobId: string;
  interviewId: string;
  candidateId: string;
  questionIds: string[];
  transcript: string;
  requestedBy: string;
  createdAt: string;
}

export interface EvaluationResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}
