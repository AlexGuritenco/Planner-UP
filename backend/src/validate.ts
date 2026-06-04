import {z} from 'zod';

// validation for task / taskRoutes
const CreateTaskSchema = z.object({
    title: z.string().min(1).max(100),
    due: z.string(),
    description: z.string().min(1).max(500).optional(),
    done: z.boolean().default(false),
});

// for patch, the fields are optional
export const PatchTaskSchema = CreateTaskSchema.partial();

// validatiom for account registration / authRoutes
export const RegisterSchema = z.object({
    username: z.string().min(1).max(30),
    email: z.string().email(),
    pass1: z.string().min(6).max(30),
    pass2: z.string().min(6).max(30),
    // also for matching passwords
}).refine((data: { pass1: string; pass2: string }) => data.pass1 === data.pass2, {
    message: 'Passwords do not match',
});

// validate for account login / authRoutes
export const LoginSchema = z.object({
    email: z.string().email(),
    pass: z.string().min(6).max(30),
});

// same goes for account patch, fields should be optional
export const PatchAccountSchema = z.object({
    username: z.string().min(1).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(30).optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type PatchTaskInput = z.infer<typeof PatchTaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type PatchAccountInput = z.infer<typeof PatchAccountSchema>;