import type { EvaluationJobPayload, EvaluationResult } from '../types/evaluation-job.js';

export class MockEvaluationProvider {
  async evaluate(job: EvaluationJobPayload): Promise<EvaluationResult> {
    const transcriptLength = job.transcript.trim().length;
    const questionFactor = Math.min(job.questionIds.length * 4, 20);
    const baseScore = Math.max(40, Math.min(95, 55 + questionFactor + Math.floor(transcriptLength / 120)));

    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    return {
      score: baseScore,
      summary: 'Mock provider produced a deterministic evaluation from transcript length and question count.',
      strengths: ['Communication clarity', 'Structured problem approach'],
      improvements: ['Edge-case discussion depth', 'Trade-off articulation'],
    };
  }
}
