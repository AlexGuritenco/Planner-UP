import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';
import {UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError} from "@src/routes/common/customErrors";

const router = Router();

let nextId: number = 1;

interface Task {
    id: number;
    userId: number;
    title: string;
    // optional
    description?: string | undefined;
    due: string;
    done: boolean;
}

const tasks: Task[] = [];

const getAllTasks = (): Task[] => {
    return tasks;
}
const getTaskById = (id: number): Task | undefined => {
    return tasks.find(task => task.id == id);
}
// use Omit<Task, 'id'> to create a new task with auto-generated id, we only provide titlem description and date
const createTask = (userId: number, data: Omit<Task, 'id'>): Task => {
    const newTask: Task = {
        ...data,
        userId,
        id: nextId++
    };
    tasks.push(newTask);
    return newTask;
}
// use Partial<Omit<Task, 'id'>> to update task with partial data, we only provide title, description and date
const updateTask = (id: number, data: Partial<Omit<Task, 'id'>>): Task | null => {
    const index = tasks.findIndex(task => task.id == id);
    if (index === -1) return null;
    // replace everything for the update
    const updated = {...data, id} as Task;
    tasks[index] = updated;
    return updated;
}

const patchTask = (id: number, data: Partial<Omit<Task, 'id'>>): Task | null => {
    const index = tasks.findIndex(task => task.id == id);
    if (index === -1) return null;
    // making sure the account exists, otherwise TS may think this can be undefined
    const existingTask = tasks[index]
    if (!existingTask) return null;
    const updated = {...existingTask, ...data};
    tasks[index] = updated;
    return updated;
}
const deleteTask = (id: number): boolean => {
    const index = tasks.findIndex(task => task.id == id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

// 1) Get: '/api/tasks' — get all tasks for the logged-in user
// deleted request body because its not used
// use '_' to  "ignore this binding/parameter
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        // since the loggedInUser might be undefined, declare it first inside a variable
        const currentUserId = req.loggedInUser.id;
        if (!currentUserId) {
            throw new NotFoundError('We couldnt find your account, please try again')
        }
        const allTasks = getAllTasks().filter(task => task.userId === currentUserId);
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
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        // check for Nan inside id
        const id = parseInt(<string>req.params.id)
        if (isNaN(id)) {
            throw new BadRequestError('Invalid task ID')
        }
        const task = getTaskById(id);
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
router.post('/', (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(201).json(createTask(req.loggedInUser!.id, data));
    } catch (error) {
        // console.error('Error creating task:', error);
        // return res.status(500).json({message: 'Internal Server Error'});
        next(error);
    }
});

// 3) Put: '/api/tasks/:id' - update an existing task, complete update
// The id identifies which task to replace; the full new task comes in the body
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
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
        const id = parseInt(<string>req.params.id)
        if (isNaN(id)) {
            throw new BadRequestError('Invalid task ID')
        }
        const updated = updateTask(id, data);
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
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const data = req.body as Partial<Omit<Task, 'id'>>;
        if (!data || Object.keys(data).length === 0) {
            // return res.status(400).json({message: 'Field must not be empty'});
            throw new BadRequestError('Field must not be empty')
        }
        const id = parseInt(<string>req.params.id)
        if (isNaN(id)) {
            throw new BadRequestError('Invalid task ID')
        }
        const updated = patchTask(id, data);
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
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.isLoggedIn || !req.loggedInUser) {
            // return res.status(401).json({message: 'Unauthorized: Please Sign Up / Log In'});
            throw new UnauthorizedError('Unauthorized: Please Sign Up / Log In')
        }
        const id = parseInt(<string>req.params.id)
        if (isNaN(id)) {
            throw new BadRequestError('Invalid task ID')
        }
        const success = deleteTask(id);
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
