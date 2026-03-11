import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorPanel, LoadingPanel } from '../components/ui/state';
import { apiClient } from '../lib/api/client';

interface AnswerForm {
  answer: string;
}

export function SessionPage() {
  const navigate = useNavigate();
  const { sessionId = '' } = useParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sessionQuery = useQuery({
    queryKey: ['web-session', sessionId],
    queryFn: () => apiClient.getSession(sessionId),
    enabled: Boolean(sessionId),
  });

  const statusQuery = useQuery({
    queryKey: ['web-session-status', sessionId],
    queryFn: () => apiClient.getSessionStatus(sessionId),
    enabled: isSubmitted,
    refetchInterval: (query) => (query.state.data?.status === 'completed' ? false : 2000),
  });

  const { register, handleSubmit, reset } = useForm<AnswerForm>({
    defaultValues: { answer: '' },
  });

  const saveAnswerMutation = useMutation({
    mutationFn: (payload: { questionId: string; answer: string }) =>
      apiClient.saveAnswer(sessionId, payload),
  });

  const submitMutation = useMutation({
    mutationFn: () => apiClient.submitSession(sessionId),
    onSuccess: () => setIsSubmitted(true),
  });

  useEffect(() => {
    const status = statusQuery.data?.status;
    if (status === 'completed') {
      navigate(`/sessions/${sessionId}/result`, { replace: true });
    }
  }, [statusQuery.data?.status, navigate, sessionId]);

  if (sessionQuery.isLoading) return <LoadingPanel label="Loading session..." />;
  if (sessionQuery.error || !sessionQuery.data) return <ErrorPanel message="Session not found." />;

  if (isSubmitted) {
    return (
      <section className="panel pending-panel">
        <h2>Evaluation in progress</h2>
        <p>Your answers were submitted successfully. We are evaluating your session.</p>
        <p>Status: {statusQuery.data?.status ?? 'evaluation_pending'}</p>
      </section>
    );
  }

  const questions = sessionQuery.data.questions;
  const currentQuestion = questions[stepIndex];
  const isLast = stepIndex === questions.length - 1;

  const onNext = handleSubmit(async (values) => {
    await saveAnswerMutation.mutateAsync({
      questionId: currentQuestion.id,
      answer: values.answer,
    });

    reset({ answer: sessionQuery.data?.answers[currentQuestion.id] ?? '' });
    if (!isLast) {
      setStepIndex((x) => x + 1);
      return;
    }

    await submitMutation.mutateAsync();
  });

  return (
    <section className="panel">
      <div className="meta-row">
        <span>Session: {sessionId}</span>
        <span>
          Question {stepIndex + 1}/{questions.length}
        </span>
      </div>

      <h3>{currentQuestion.prompt}</h3>

      <form onSubmit={onNext} className="answer-form">
        <textarea
          rows={8}
          placeholder="Write your answer..."
          defaultValue={sessionQuery.data.answers[currentQuestion.id] ?? ''}
          {...register('answer', { required: true })}
        />

        <div className="flow-actions">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((x) => Math.max(0, x - 1))}
          >
            Previous
          </button>
          <button type="submit" disabled={saveAnswerMutation.isPending || submitMutation.isPending}>
            {isLast ? 'Submit Interview' : 'Save & Next'}
          </button>
        </div>
      </form>
    </section>
  );
}
