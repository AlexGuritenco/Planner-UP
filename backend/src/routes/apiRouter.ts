import { Router } from 'express';

import Paths from '@src/common/constants/Paths';

import authRoutes from './authRoutes';
import tasksRoutes from './tasksRoutes';
import accountRoutes from './accountRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ----------------------- Add UserRouter --------------------------------- //

const userRouter = Router();

apiRouter.use(Paths.Auth._, authRoutes);
apiRouter.use(Paths.Tasks._, tasksRoutes);
apiRouter.use(Paths.Account._, accountRoutes);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
