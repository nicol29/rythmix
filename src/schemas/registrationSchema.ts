import { z } from "zod";


const registrationSchema = z
  .object ({
    userName: z.string().min(1, {message: "Must provide a username"}),
    email: z.string().email({message: "Must provide a valid email address"}),
    userType: z.string().refine((value) => {
      return value !== "";
    }, {
      message: 'Must select one',
    }),
    password: z.string().min(6).max(30),
    confirmPassword: z.string()
}).refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
});



export default registrationSchema;