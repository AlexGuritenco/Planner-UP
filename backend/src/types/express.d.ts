import * as express from 'express';

declare global {
    namespace Express {
        export interface Request {
            isLoggedIn: boolean;
            loggedInUser?: {
                id: number;
                email: string;
                username?: string;
            };
        }
    }
}
