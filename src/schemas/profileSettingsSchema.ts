import { z } from "zod";


export const profileSettingsSchema = z
  .object ({
    userName: z.string().min(1, {message: "Must provide a valid userName"}).max(30),
    profileUrl: z.string().min(1, {message: "Must provide a valid profile url"}).max(30),
    biography: z.string().max(200),
});

export type TProfileSettingsSchema = z.infer<typeof profileSettingsSchema>;