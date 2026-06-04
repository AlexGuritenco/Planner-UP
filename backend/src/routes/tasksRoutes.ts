import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';
import {UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError} from "@src/routes/common/customErrors";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    patchTask,
    deleteTask,
} from "@src/db";
import {CreateTaskInput, PatchTaskInput} from "@src/validate";
import {ObjectId} from "mongodb";

const router = Router();

// 1) Get: '/api/tasks' — get all tasks for the logged-in user
// deleted request body because its not used
// use '_' to  "ignore this binding/parameter
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        // since the loggedInUser might be undefined, declare it first inside a variable
        const currentUserId = req.loggedInUser._id;
        if (!currentUserId) {
            throw new NotFoundError('We couldnt find your account, please try again')
        }
        const allTasks = await getAllTasks(currentUserId);
        // return status 200 and json
        return res.status(200).json({tasks: allTasks});
    } catch (error) {
        // console.error('Error fetching tasks:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});

// 1.1) Get: '/api/tasks/:id' - return a single task
// :id in the path is a route parameter; Express captures it in req.params.id.
router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const {id} = req.params;
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID');
        }
        const task = await getTaskById(id);
        if (!task) {
            // return res.status(404).json({message: 'Task not found'});
            throw new NotFoundError('Task not found')
        }
        return res.status(200).json({task});
    } catch (error) {
        // console.error('Error fetching tasks:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});

// 2) Post: '/api/tasks/' - create a new task
// The task data arrives in the request body as JSON (parsed by express.json())
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const data = req.body;
        if (!data.title || !data.due) {
            // return res.status(400).json({message: 'Required fields: Title, Due (date)'});
            throw new BadRequestError('Required fields: Title, Due (date)')
        }
        const task = await createTask(req.loggedInUser._id, data);
        return res.status(201).json(task);
    } catch (error) {
        // console.error('Error creating task:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});

// 3) Put: '/api/tasks/:id' - update an existing task, complete update
// The id identifies which task to replace; the full new task comes in the body
router.put('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const data = req.body;
        if (!data || !data.title || data.due === undefined) {
            // return res.status(400).json({message: 'Required fields: Title, Due date'});
            throw new BadRequestError('Required fields: Title, Due date')
        }
        const {id} = req.params
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        const updated = await updateTask(id, data);
        if (!updated) {
            // return res.status(404).json({message: 'Task not found'});
            throw new NotFoundError('Task not found')
        }
        return res.status(200).json({task: updated});
    } catch (error) {
        // console.error('Error updating task:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});
// 3.1) Patch: '/api/tasks/:id' - update an existing task, partial update
router.patch('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const data = req.body
        if (!data || Object.keys(data).length === 0) {
            // return res.status(400).json({message: 'Field must not be empty'});
            throw new BadRequestError('Field must not be empty')
        }
        const {id} = req.params
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        const updated = await patchTask(id, data);
        if (!updated) {
            // return res.status(404).json({message: 'Task not found'});
            throw new NotFoundError('Task not found')
        }
        return res.status(200).json({task: updated});
    } catch (error) {
        // console.error('Error updating task:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});

// 4) Delete: '/api/tasks/:id' - delete a task
// On success we return 204 No Content: the operation succeeded, there is
// nothing meaningful to send back. The status code carries the result.
router.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const {id} = req.params
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid task ID (ID not valid)')
        }
        const success = await deleteTask(id);
        if (!success) {
            // return res.status(404).json({message: 'Task not found'});
            throw new NotFoundError('Task not found')
        }
        // No body — 204 means "it's done, nothing to say"
        return res.status(204).send();
    } catch (error) {
        // console.error('Error deleting task:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});

export default router;
