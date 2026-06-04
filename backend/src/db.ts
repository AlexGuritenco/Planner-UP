// =============================================================================
// db.ts — Database Connection Module and DB Helper Functions
//
// This module encapsulates everything related to MongoDB:
//   - The connection setup (connectDB, getCollection)
//   - All database operations for dishes and orders as named async functions
//
// app.ts imports and calls these functions; it never touches the driver directly.
// This mirrors the Week 9 pattern where helper functions operated on in-memory
// arrays — here they operate on MongoDB collections instead.
//
// Exports:
//   connectDB()                              — opens connection, exits on failure
//   getCollection(name)                      — returns a named collection reference
//   ObjectId                                 — re-exported for ID validation in routes
// =============================================================================

// Load environment variables from .env into process.env
import bcrypt from "bcryptjs";

require('dotenv').config();

const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbName = process.env.DB_NAME || 'PlannerUp'

// connect to Atlas and verify the conenction with a ping
export async function connectDB(): Promise<void> {
    try {
        await client.connect();
        await client.db(dbName).command({ping: 1});
        console.log(`Connected to MongoDB; Database: ${dbName}`);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        // force exit
        process.exit(1);
    }
}

export function getCollection(name: string) {
    return client.db(dbName).collection(name);
}

// from tasksRoutes.ts
// the interface of a task ( should have these values )
interface Task {
    userId: string;
    title: string;
    // optional
    description?: string | undefined;
    due: string;
    done: boolean;
}

// create a task
// db.ts
export async function createTask(userId: string, data: Omit<Task, 'userId'>): Promise<Task> {
    const doc = { ...data, userId };
    await getCollection('tasks').insertOne(doc);
    return doc;
}

// read a task
export async function getAllTasks(userId: string): Promise<Task[]> {
    return getCollection('tasks').find({ userId }).toArray();
}

export async function getTaskById(id: string): Promise<Task | null> {
    if (!ObjectId.isValid(id)) return null;
    // without the new objectid, _id is a string and cannot match a stored ObjectId
    return getCollection('tasks').findOne({_id: new ObjectId(id)});
}

// update
export async function updateTask(id: string, data: Task): Promise<Task | null> {
    if (!ObjectId.isValid(id)) return null;
    return getCollection('tasks').findOneAndReplace(
        {_id: new ObjectId(id)},
        // full replacement
        {...data},
        {returnDocument: 'after'}
    );
}

export async function patchTask(id: string, data: Task): Promise<Task | null> {
    if (!ObjectId.isValid(id)) return null;
    return getCollection('tasks').findOneAndUpdate(
        {_id: new ObjectId(id)},
        // update only the provided fields
        {$set: data},
        {returnDocument: 'after'}
    );
}

// delete
export async function deleteTask(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await getCollection('tasks').deleteOne({_id: new ObjectId(id)});
    return result.deletedCount > 0;
}

// from authRoutes.ts
// RegisterInput is what comes from the registration
interface RegisterInput {
    username: string;
    email: string;
    pass1: string;
}

// Register is what is stored in the database, with no password
interface Register {
    _id: string;
    username: string;
    email: string;
}

// create
export async function createAccount(data: RegisterInput): Promise<RegisterInput> {
    const hashedPassword = await bcrypt.hash(data.pass1, 10);
    const doc = {
        username: data.username,
        email: data.email,
        pass1: hashedPassword,
    }
    await getCollection('accounts').insertOne(doc);
    return doc;
}

// check user
export async function checkUser(email: string, password: string): Promise<Register | null> {
    const user = await getCollection('accounts').findOne({email});
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.pass1);
    if (!isMatch) return null;
    // safest return is without a password
    const {pass1: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

// from accountRoutes.ts
interface AccountData {
    username: string;
    email: string;
    password: string;
}

// read
export async function getUserById(id: string): Promise<AccountData | null> {
    if (!ObjectId.isValid(id)) return null;
    // without the new objectid, _id is a string and cannot match a stored ObjectId
    return getCollection('accounts').findOne({_id: new ObjectId(id)});
}

// patch
export async function patchAccount(id: string, data: AccountData): Promise<AccountData | null> {
    if (!ObjectId.isValid(id)) return null;
    return getCollection('accounts').findOneAndUpdate(
        {_id: new ObjectId(id)},
        // update only the provided fields
        {$set: data},
        {returnDocument: 'after'}
    );
}

// delete
export async function deleteAccount(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await getCollection('accounts').deleteOne({_id: new ObjectId(id)});
    return result.deletedCount > 0;
}
