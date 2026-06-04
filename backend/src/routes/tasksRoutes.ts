import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';
import {UnauthorizedError, NotFoundError, BadRequestError} from "@src/routes/common/customErrors";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    patchTask,
    deleteTask,
} from "@src/db";
import {CreateTaskSchema, PatchTaskSchema} from "@src/validate";
import {ObjectId} from "mongodb";

const router = Router();

// 1) Get: '/api/tasks' — get all tasks for the logged-in user
// deleted request body because its not used
// use '_' to  "ignore this binding/parameter
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        // since the loggedInUser might be undefined, declare it first inside a variable
        const currentUserId = req.loggedInUser._id;
        if (!currentUserId) {
            throw new NotFoundError('We couldnt find your account, please try again')
        }
        const allTasks = await getAllTasks(currentUserId);
        return res.status(200).json({tasks: allTasks});
    } catch (error) {
        next(error);
    }
});

// 1.1) Get: '/api/tasks/:id' - return a single task
// :id in the path is a route parameter; Express captures it in req.params.id.
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const {id} = req.params;
        const userId = req.loggedInUser._id;
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID');
        }
        const task = await getTaskById(id, userId);
        if (!task) {
            throw new NotFoundError('Task not found')
        }
        return res.status(200).json({task});
    } catch (error) {
        next(error);
    }
});

// 2) Post: '/api/tasks/' - create a new task
// The task data arrives in the request body as JSON (parsed by express.json())
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const result = CreateTaskSchema.safeParse(req.body)
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0]?.message ?? 'Invalid task data');
        }
        const task = await createTask(req.loggedInUser._id, result.data);
        return res.status(201).json(task);
    } catch (error) {
        next(error);
    }
});

// 3) Put: '/api/tasks/:id' - update an existing task, complete update
// The id identifies which task to replace; the full new task comes in the body
router.put('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const result = CreateTaskSchema.safeParse(req.body);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0]?.message ?? 'Invalid task data');
        }
        const data = result.data
        const {id} = req.params
        const userId = req.loggedInUser._id
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        const updated = await updateTask(id, userId, data);
        if (!updated) {
            throw new NotFoundError('Task not found')
        }
        return res.status(200).json({task: updated});
    } catch (error) {
        next(error);
    }
});
// 3.1) Patch: '/api/tasks/:id' - update an existing task, partial update
router.patch('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const result = PatchTaskSchema.safeParse(req.body);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0]?.message ?? 'Invalid task data');
        }
        const data = result.data
        const {id} = req.params
        const userId = req.loggedInUser._id
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        const updated = await patchTask(id, userId, data);
        if (!updated) {
            throw new NotFoundError('Task not found')
        }
        return res.status(200).json({task: updated});
    } catch (error) {
        next(error);
    }
});

// 4) Delete: '/api/tasks/:id' - delete a task
// On success we return 204 No Content: the operation succeeded, there is
// nothing meaningful to send back. The status code carries the result.
router.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const {id} = req.params
        const userId = req.loggedInUser._id
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        const success = await deleteTask(id, userId);
        if (!success) {
            throw new NotFoundError('Task not found')
        }
        // No body — 204 means "it's done, nothing to say"
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
