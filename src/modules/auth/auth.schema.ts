import {z} from "zod"

export const registerUserSchema = z.object({
    username: z.string().min(3,"Username must be 3 characters long"),
    email: z.email("Email is required"),
    password: z.string().min(6,"Passowrd must be at least 6 chracters long")
}).strict()

export const loginUserSchema = z.object({
    email:z.email("Email is required"),
    password:z.string()
}).strict()

export const refreshTokenSchema = z.object({
    token: z.string()
}).strict()

export type registerUserDTO = z.infer<typeof registerUserSchema>
export type loginUserDTO = z.infer<typeof loginUserSchema>
export type refeshTokenDTO = z.infer<typeof refreshTokenSchema>
