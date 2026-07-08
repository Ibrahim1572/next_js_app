import {z} from 'zod'

export const logInSchema=z.object({
    email: z.string().trim().toLowerCase(),
    password: z.string()
})