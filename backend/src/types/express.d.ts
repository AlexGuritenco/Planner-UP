import * as express from 'express';

declare global {
    namespace Express {
        export interface Request {
            isLoggedIn: boolean;
            loggedInUser?: {
                _id: string;
                email: string;
                username?: string;
            };
        }
    }
}
