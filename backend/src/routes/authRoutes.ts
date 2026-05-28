import type { Request, Response } from 'express';
import { Router } from 'express';

const router = Router();

let nextId: number = 1;

interface Register {
    id: number;
    username: string;
    email: string;
    pass1: string;
}
const account: Register[] = [];

const createAccount = (data:Omit<Register, 'id'>): Register => {
    const newAccount: Register = {
        ...data,
        id: nextId++
    }
    account.push(newAccount);
    return newAccount;
};


// Post: both login and register/signup and logout
// The id identifies which task to replace; the full new task comes in the body
router.post('/register', (req:Request, res:Response) => {
    try {
        const data = req.body;
        if (!data || !data.username || !data.email || !data.pass1 || !data.pass2 || data.pass1 !== data.pass2) {
            return res.status(400).json({message: 'Required field: Username, Email, Password, Confirm Password'});
        }
        return res.status(201).json(createAccount(data));
    } catch(error){
        console.error('Error creating account:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/login', (req:Request, res:Response) => {
    try {
        const data = req.body;
        if (!data || !data.email || !data.pass1 ) {
            return res.status(400).json({message: 'Required field: Email, Password, Confirm Password'});
        }
        const existsAcc = account.find(a => a.email === data.email && a.pass1 === data.pass1)
        if (!existsAcc) {
            return res.status(400).json({message: 'Account does not exist'});
        }
        return res.status(200).json(existsAcc);
    } catch(error){
        console.error('Error logging in:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router;