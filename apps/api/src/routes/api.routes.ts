import { Router } from 'express';

import { authenticate } from '../middleware/auth.js';
import { analyticsRouter } from '../modules/analytics/analytics.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { evaluationsRouter } from '../modules/evaluations/evaluations.routes.js';
import { interviewsRouter } from '../modules/interviews/interviews.routes.js';
import { sessionsRouter } from '../modules/interviews/sessions.routes.js';
import { questionsRouter } from '../modules/questions/questions.routes.js';
import { searchRouter } from '../modules/search/search.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use(authenticate);
apiRouter.use('/users', usersRouter);
apiRouter.use('/interviews', interviewsRouter);
apiRouter.use('/sessions', sessionsRouter);
apiRouter.use('/questions', questionsRouter);
apiRouter.use('/evaluations', evaluationsRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/search', searchRouter);

export { apiRouter };
