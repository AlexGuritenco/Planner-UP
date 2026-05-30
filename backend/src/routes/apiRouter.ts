import {Router} from 'express';

import Paths from '@src/common/constants/Paths';

import authRoutes, {customAuthMiddleware} from './authRoutes';
import tasksRoutes from './tasksRoutes';
import accountRoutes from './accountRoutes';

/******************************************************************************
 Setup
 ******************************************************************************/

const apiRouter = Router();

// ----------------------- Add UserRouter --------------------------------- //

const userRouter = Router();

// so this route is public for everyone
apiRouter.use(Paths.Auth._, authRoutes);
// this is the middleware that will check if the user is logged in
apiRouter.use(customAuthMiddleware);
// these are the protected routes
apiRouter.use(Paths.Tasks._, tasksRoutes);
apiRouter.use(Paths.Account._, accountRoutes);

/******************************************************************************
 Export
 ******************************************************************************/

export default apiRouter;
