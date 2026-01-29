import {email, z} from 'zod';

export const signupschema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(255, 'Name must be at most 255 characters long').trim(),
    email: z.string().email('Invalid email address').max(255, 'Email must be at most 255 characters long').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 8 characters long').max(128, 'Password must be at most 128 characters long'),
    role: z.enum(['user', 'admin']).default('user'),
});

export const signinschema = z.object({
    email: z.string().email('Invalid email address').max(255, 'Email must be at most 255 characters long').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 8 characters long').max(128, 'Password must be at most 128 characters long'),
});