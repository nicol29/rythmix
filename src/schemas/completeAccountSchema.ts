import { z } from "zod";


export const completeAccountSchema = z
  .object ({
    userName: z.string().min(1, {message: "Must provide a username"}),
    userType: z.string().refine((value) => {
      return value !== "";
    }, {
      message: 'Must select one',
    }),
})

export type TCompleteAccountSchema = z.infer<typeof completeAccountSchema>;