import { useEffect, useState } from 'react';

import { apiClient } from '../api/client';

export interface EvaluationStatusEvent {
  evaluationId: string;
  status: 'processing' | 'completed' | 'failed';
  score?: number;
}

export function useEvaluationSSE(onEvent: (event: EvaluationStatusEvent) => void) {
  const [state, setState] = useState<'idle' | 'connected' | 'error'>('idle');

  useEffect(() => {
    const url = apiClient.getEvaluationsSSEUrl();
    const source = new EventSource(url, { withCredentials: false });

    source.onopen = () => {
      setState('connected');
    };

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as EvaluationStatusEvent;
        onEvent(parsed);
      } catch {
        setState('error');
      }
    };

    source.onerror = () => {
      setState('error');
    };

    return () => {
      source.close();
    };
  }, [onEvent]);

  return state;
}
