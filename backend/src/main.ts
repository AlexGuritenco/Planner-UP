import logger from 'jet-logger';

import EnvVars from './common/constants/env';
import server from './server';
import { connectDB } from './db';

/******************************************************************************
 Constants
 ******************************************************************************/

const SERVER_START_MESSAGE =
    'Express server started on port: ' + EnvVars.Port.toString();

/******************************************************************************
 Run
 ******************************************************************************/

// Start the server
// but first connect to the database
connectDB().then(() => {
    server.listen(EnvVars.Port, (err) => {
        if (!!err) {
            logger.err(err.message);
        } else {
            logger.info(SERVER_START_MESSAGE);
        }
    });
});