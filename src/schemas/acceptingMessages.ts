import {z} from 'zod'

export const acceptingMessagesSchema = z.object({
    accpetMessages : z.boolean()
})