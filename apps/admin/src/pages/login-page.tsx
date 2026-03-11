import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '../features/auth/use-auth';

const loginSchema = z.object({
  email: z.email('Valid email is required'),
  role: z.enum(['admin', 'interviewer', 'candidate']),
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
      email: 'admin@interviewflow.ai',
      role: 'admin',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      const redirect = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(redirect, { replace: true });
    } catch {
      setError('Login failed. Please verify API connection and credentials.');
    }
  });

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>InterviewFlow AI</h1>
        <p>Sign in to manage interviews, evaluations, and analytics.</p>

        <form onSubmit={onSubmit} className="login-form">
          <label>
            Email
            <input type="email" {...register('email')} />
            {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
          </label>

          <label>
            Role
            <select {...register('role')}>
              <option value="admin">Admin</option>
              <option value="interviewer">Interviewer</option>
              <option value="candidate">Candidate</option>
            </select>
            {errors.role ? <span className="field-error">{errors.role.message}</span> : null}
          </label>

          {error ? <div className="error-state">{error}</div> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
