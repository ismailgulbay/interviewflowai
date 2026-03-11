import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '../features/auth/use-auth';

const loginSchema = z.object({
  email: z.email('Valid email required'),
  role: z.enum(['candidate', 'interviewer', 'admin']),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'candidate@interviewflow.ai',
      role: 'candidate',
    },
  });

  const submit = handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      const from = (location.state as { from?: string } | undefined)?.from ?? '/dashboard';
      navigate(from, { replace: true });
    } catch {
      setError('Login failed. Check API and try again.');
    }
  });

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Start Your Interview</h1>
        <p>Sign in and continue your technical interview flow.</p>

        <label>
          Email
          <input type="email" {...register('email')} />
          {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
        </label>

        <label>
          Role
          <select {...register('role')}>
            <option value="candidate">Candidate</option>
            <option value="interviewer">Interviewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {error ? <div className="error-panel">{error}</div> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
