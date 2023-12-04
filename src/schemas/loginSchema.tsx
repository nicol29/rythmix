import { z } from "zod";


const loginSchema = z
  .object ({
    email: z.string().email({message: "Must provide a valid email address"}),
    password: z.string().min(1, {message: "Enter password"}),
})


export default loginSchema;