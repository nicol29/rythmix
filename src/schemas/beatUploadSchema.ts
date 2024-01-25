import { z } from "zod";


export const beatUploadSchema = z
  .object ({
    userName: z.string().min(1, {message: "Must provide a username"}),
    userType: z.string().refine((value) => {
      return value !== "";
    }, {
      message: 'Must select one',
    }),
})

export type TBeatUploadSchema = z.infer<typeof beatUploadSchema>;