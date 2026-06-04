import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';
import {NotFoundError, BadRequestError, ConflictError, UnauthorizedError} from "@src/routes/common/customErrors";
import {
    createAccount,
    checkUser, getUserById, getCollection
} from "@src/db"

const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// The JWT secret comes from .env.
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_teaching_key';

function createToken(user: { _id: string; username: string; email: string }): string {
    return jwt.sign(user, JWT_SECRET, {expiresIn: '1h'});
}

// middleware -> function to handle the token in the middle between request and response
// Register globally — every route defined below here runs through this middleware.
// Note: /login (defined above) is intentionally excluded from this check.
export function customAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    // Default to "not logged in" — safe fallback if no token is provided
    req.isLoggedIn = false;
    req.loggedInUser = undefined;

    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer')) {
        // the actual token inside
        const token = authHeader.split(' ')[1];

        try {
            const decodedPayload = jwt.verify(token, JWT_SECRET);
            req.isLoggedIn = true;
            req.loggedInUser = decodedPayload;
        } catch (error) {
            // We log the reason but don't expose it to the client.
            // console.log('Error verifying token:', error);
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.log('Invalid token');
            }
        }

    }
    next();
}

// Post: both login and register/signup and logout
// The id identifies which task to replace; the full new task comes in the body
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        if (!data || !data.username || !data.email || !data.pass1 || !data.pass2 || data.pass1 !== data.pass2) {
            // return res.status(400).json({message: 'Required field: Username, Email, Password, Confirm Password'});
            throw new BadRequestError('Required field: Username, Email, Password, Confirm Password');
        }
        const exists = await getCollection('accounts').findOne({email: data.email});
        if (exists) {
            throw new ConflictError('Email already is use');
        }
        return res.status(201).json(createAccount(data));
    } catch (error) {
        // console.error('Error creating account:', error);
        // return res.status(500).json({message: 'Internal server error'});
        next(error);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        if (!data || !data.email || !data.pass1) {
            // return res.status(400).json({message: 'Required field: Email, Password, Confirm Password'});
            throw new BadRequestError('Required field: Email, Password, Confirm Password')
        }
        // const existsAcc = account.find(a => a.email === data.email && a.pass1 === data.pass1)
        const existsAcc = await checkUser(data.email, data.pass1);
        if (!existsAcc) {
            // return res.status(400).json({message: 'Account does not exist'});
            throw new NotFoundError('Account does not exist')

        }
        const token = createToken(existsAcc);
        return res.status(200).json({token});
    } catch (error) {
        // console.error('Error logging in:', error);
        // return res.status(500).json({message: 'Internal server error'});
        next(error);
    }
});


export default router;