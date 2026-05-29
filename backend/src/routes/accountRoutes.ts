import type {Request, Response} from 'express';
import {Router} from 'express';

const router = Router();

interface AccountData {
    id: number;
    username: string;
    email: string;
    password: string;
}

const accounts: AccountData[] = [
  {
    id: 1,
    username: 'adminStudent',
    email: 'admin@example.com',
    password: 'password123'
  }
];

const getUserById = (id: number): AccountData | undefined => {
    return accounts.find(acc => acc.id == id);
};

const patchAccount = (id: number, data: Partial<Omit<AccountData, 'id'>>): AccountData | null => {
    const index = accounts.findIndex(acc => acc.id == id);
    if (index === -1) return null;
    // making sure the task exists, otherwise TS may think this can be undefined
    const existingAccount = accounts[index]
    if (!existingAccount) return null
    const update = {...existingAccount, ...data};
    accounts[index] = update;
    return update;
};

const deleteAccount = (id: number): boolean => {
    const index = accounts.findIndex(acc => acc.id == id);
    if (index === -1) return false;
    accounts.splice(index, 1)
    return true;
};

router.get('/:id', (req: Request, res: Response) => {
    // try {
    //     const account = getUserById(parseInt(<string>req.params.id));
    //     if (!account) {
    //         return res.status(404).json({message: 'Account not found'});
    //     }
    //     return res.status(200).json(account.username);
    // } catch(error) {
    //     console.error('Error fetching account:', error);
    //     return res.status(500).json({message: 'Internal server error'});
    // }
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
        }
        const targetId = parseInt(<string>req.params.id)
        if (isNaN(targetId) || req.loggedInUser.id !== targetId) {
            return res.status(403).json({message: 'Forbidden: You do not have permission to access this account'});
        }
        const account = getUserById(targetId);
        if (!account) {
            return res.status(404).json({message: 'Account not found'});
        }
        // return res.status(200).json(account.username);
        // better to send the email and the password, so strip away the pass
        const { password, ...safeAccountDetails } = account;
        return res.status(200).json(safeAccountDetails);
    } catch (error) {
        console.error('Error fetching account:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.patch('/:id', (req: Request, res: Response) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
        }
        const targetId = parseInt(<string>req.params.id)
        if (isNaN(targetId) || req.loggedInUser.id !== targetId) {
            return res.status(403).json({message: 'Forbidden: You do not have permission to access this account'});
        }
        const data = req.body as Partial<Omit<AccountData, 'id'>>;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({message: 'No fields provided'});
        }
        if (data.password != undefined && data.password !== req.body.pass2) {
            return res.status(400).json({message: 'Passwords do not match'});
        }
        const updated = patchAccount(parseInt(<string>req.params.id), data);
        if (!updated) {
            return res.status(404).json({message: 'Account not found'});
        }
        return res.status(200).json({account: updated});
    } catch (error) {
        console.error('Error updating account:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
        }
        const targetId = parseInt(<string>req.params.id)
        if (isNaN(targetId) || req.loggedInUser.id !== targetId) {
            return res.status(403).json({message: 'Forbidden: You do not have permission to access this account'});
        }
        const success = deleteAccount(parseInt(<string>req.params.id));
        if (!success) {
            return res.status(404).json({message: 'Account not found'});
        }
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router;