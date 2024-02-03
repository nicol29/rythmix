import { z } from "zod";

const licenseSchema = z.object({
  price: z.number().min(0), 
  selected: z.boolean(),    
});

export const beatUploadSchema = z.object ({
  title: z.string().min(1, {message: "Must provide a title"}),
  bpm: z.string().refine((value) => !value || !isNaN(parseFloat(value)), {
    message: "Must be a number",
  }),
  key: z.string(),
  genre: z.string(),
  mood: z.string(),
  licenses: z.object({
    basic: licenseSchema,
    premium: licenseSchema,
    exclusive: licenseSchema,
  }).refine((value) => value.basic.selected || value.premium.selected || value.exclusive.selected, { 
    message: "Atleast one license must be picked" 
  }),
})

export type TBeatUploadSchema = z.infer<typeof beatUploadSchema>;