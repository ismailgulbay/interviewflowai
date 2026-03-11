import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env.js';
import type { UserRole } from '../../middleware/auth.js';

interface LoginInput {
  email: string;
  role: UserRole;
}

export function signLoginToken(input: LoginInput): string {
  return jwt.sign(
    {
      email: input.email,
      role: input.role,
    },
    env.JWT_SECRET,
    {
      subject: `user:${input.email}`,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    },
  );
}
