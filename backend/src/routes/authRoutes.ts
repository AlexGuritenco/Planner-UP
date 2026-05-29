import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';

const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let nextId: number = 1;

interface Register {
    id: number;
    username: string;
    email: string;
    pass1: string;
}
const account: Register[] = [];

const createAccount = (data: Omit<Register, 'id'>): Register => {
    const newAccount: Register = {
        ...data,
        id: nextId++
    }
    account.push(newAccount);
    return newAccount;
};

// The JWT secret comes from .env.
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_teaching_key';

// also hardencoded admin
const hardcodedUser = {id: 1, username: 'adminStudent', email: 'admin@example.com'};
const hardcodedHashedPassword = bcrypt.hashSync('password123', 10);

async function checkUser(email: string, password: string): Promise<typeof hardcodedUser | null> {
    if (email === hardcodedUser.email) {
        const isMatch = await bcrypt.compare(password, hardcodedHashedPassword);
        if (isMatch) return hardcodedUser;
    }
    return null;
}

function createToken(user: typeof hardcodedUser): string {
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
            console.log('Error verifying token:', error);
        }
    }
    next();
}


// Post: both login and register/signup and logout
// The id identifies which task to replace; the full new task comes in the body
router.post('/register', (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data || !data.username || !data.email || !data.pass1 || !data.pass2 || data.pass1 !== data.pass2) {
            return res.status(400).json({message: 'Required field: Username, Email, Password, Confirm Password'});
        }
        return res.status(201).json(createAccount(data));
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data || !data.email || !data.pass1) {
            return res.status(400).json({message: 'Required field: Email, Password, Confirm Password'});
        }
        // const existsAcc = account.find(a => a.email === data.email && a.pass1 === data.pass1)
        const existsAcc = await checkUser(data.email, data.pass1);
        if (!existsAcc) {
            return res.status(400).json({message: 'Account does not exist'});
        }
        const token = createToken(existsAcc);
        return res.status(200).json({token});
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router;