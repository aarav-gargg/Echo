import { z } from 'zod'

export const messagesSchema = z.object({
    content: z.string().min(10, { message: "Content should be at least 10 characters" }).max(250, { message: "Content should be at max 250 characters" }),
    password: z.string()
})