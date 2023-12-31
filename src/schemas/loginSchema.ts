import { z } from "zod";


export const loginSchema = z
  .object ({
    email: z.string().email({message: "Must provide a valid email address"}),
    password: z.string().min(1, {message: "Enter password"}),
})

export type TLogInSchema = z.infer<typeof loginSchema>;