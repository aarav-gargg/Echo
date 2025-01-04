import {z} from 'zod'


export const codeValidation = z.string().min( 6 , {message : "Verification code must be 6 digits"})

export const verifySchema = z.object({
    code : codeValidation
})