import {z} from 'zod'

export const addPost=z.object({
    title: z.string().trim().min(3, "Title is too short").max(100, "Title too long"),
    body: z.string().trim().min(3, "Body is too short").max(500, "Body too long")
})

export const updatePost=z.object({
    title: z.string().trim().min(3, "Title is too short").max(100, "Title too long"),
    body: z.string().trim().min(3, "Body is too short").max(500, "Body too long")
})

export const searchPost=z.object({
    title: z.string().trim().min(1).optional()
})
