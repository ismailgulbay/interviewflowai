import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'interviewer', 'candidate']),
});
