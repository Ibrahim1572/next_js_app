import {z} from 'zod'

export const signUpSchema=z.object({
    username: z.string().min(3, 'Username must be more than 3 characters').max(30, "Username can't be more than 30 characters"),
    email: z.string().regex(/^[a-z0-9@.]+$/, "Invalid email format"),
    password: z.string().min(3, 'Password must be more than 3 characters')
})