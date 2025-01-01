import {z} from 'zod'

 export const usernameValidation = z
        .string()
        .min(6 , "Username should contains at least 6 characters")
        .max(26 , "Username should not contain more than 26 characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password should be at least 8 characters"),
    
})
