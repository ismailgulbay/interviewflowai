import { Schema, model } from 'mongoose';

interface EvaluationRecordDocument {
  jobId: string;
  interviewId: string;
  candidateId: string;
  status: 'completed' | 'failed';
  attempt: number;
  score?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  errorMessage?: string;
  processedAt: Date;
}

const evaluationRecordSchema = new Schema<EvaluationRecordDocument>(
  {
    jobId: { type: String, required: true, index: true, unique: true },
    interviewId: { type: String, required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    status: { type: String, enum: ['completed', 'failed'], required: true },
    attempt: { type: Number, required: true },
    score: { type: Number },
    summary: { type: String },
    strengths: { type: [String] },
    improvements: { type: [String] },
    errorMessage: { type: String },
    processedAt: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const EvaluationRecordModel = model<EvaluationRecordDocument>(
  'EvaluationRecord',
  evaluationRecordSchema,
);
