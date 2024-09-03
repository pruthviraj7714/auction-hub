import  z from "zod"
export const signUpSchema = z.object({
    username : z.string().min(3,"Username should be at least of 3 characters"),
    email : z.string().email("Email should be valid"),
    password : z.string().min(6, "Password Should be at least of 6 characters")
})

export const signInSchema = z.object({
    email : z.string().email("Email should be valid"),
    password : z.string().min(6, "Password Should be at least of 6 characters")
})