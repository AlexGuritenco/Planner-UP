import express, {NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {CustomError} from '@src/routes/common/customErrors';
import Paths from '@src/common/constants/Paths';
import {RouteError} from '@src/common/utils/route-errors';
import BaseRouter from '@src/routes/apiRouter';

import EnvVars, {NodeEnvs} from './common/constants/env';

/******************************************************************************
 Setup
 ******************************************************************************/

const app = express();

// **** Middleware **** //

// Basic middleware
app.use(cors({origin: 'http://localhost:5173'}))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.DEV) {
    app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
    app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths._, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    if (EnvVars.NodeEnv !== NodeEnvs.TEST.valueOf()) {
        logger.err(err, true);
    }
    // check if its one of our custom errors
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({message: err.message});
    }
    if (err instanceof RouteError) {
        return res.status(err.status).json({error: err.message});
    }
    return res.status(500).json({message: 'Internal server error'});
});

// **** FrontEnd Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
    return res.redirect('/users');
});

// Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
    return res.sendFile('users.html', {root: viewsDir});
});

/******************************************************************************
 Export default
 ******************************************************************************/

export default app;
