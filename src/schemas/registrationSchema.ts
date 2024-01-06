import { z } from "zod";


export const registrationSchema = z
  .object ({
    email: z.string().email({message: "Must provide a valid email address"}),
    password: z.string().min(6, {message: "Password must contain at least 6 characters"}).max(30),
    confirmPassword: z.string()
}).refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
});

export type TRegistrationSchema = z.infer<typeof registrationSchema>;