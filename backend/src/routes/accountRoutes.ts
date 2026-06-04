import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';
import {UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError} from "@src/routes/common/customErrors";
import {
    getUserById,
    patchAccount,
    deleteAccount
} from '@src/db'
import {ObjectId} from "mongodb";
import {PatchAccountSchema} from "@src/validate";

const router = Router();

router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In');
        }
        const {id} = req.params
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        if (req.loggedInUser._id !== id) {
            throw new ForbiddenError('Forbidden: Access denied');
        }
        const account = await getUserById(id);
        if (!account) {
            // return res.status(404).json({message: 'Account not found'});
            throw new NotFoundError('Account not found');
        }
        // we already handled the safe part inside the db so return the account we receive
        return res.status(200).json(account);
    } catch (error) {
        // instead of here, send it to the global handler
        // console.error('Error fetching account:', error);
        // return res.status(500).json({message: 'Internal server error'});
        next(error);
    }
});

router.patch('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In');
        }
        const {id} = req.params;
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid account ID');
        }
        if (req.loggedInUser._id !== id) {
            throw new ForbiddenError('Forbidden: Access denied');
        }
        const result = PatchAccountSchema.safeParse(req.body);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0]?.message ?? 'Invalid account data');
        }
        const updated = await patchAccount(id, result.data);
        if (!updated) {
            throw new NotFoundError('Account not found');
        }
        return res.status(200).json({account: updated});
    } catch (error) {
        // console.error('Error updating account:', error);
        // return res.status(500).json({message: 'Internal server error'});
        next(error);
    }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In');
        }
        const {id} = req.params;
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid account ID');
        }
        if (req.loggedInUser._id !== id) {
            throw new ForbiddenError('Forbidden: Access denied');
        }
        const success = await deleteAccount(id);
        if (!success) {
            throw new NotFoundError('Account not found');
        }
        return res.status(204).send();
    } catch (error) {
        // console.error('Error deleting account:', error);
        // return res.status(500).json({message: 'Internal server error'});
        next(error);
    }
});

export default router;