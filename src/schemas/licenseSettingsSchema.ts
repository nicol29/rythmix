import { z } from "zod";


export const licenseSettingsSchema = z
  .object ({
    distributionCopies: z.string().min(1),
    audioStreams: z.string().min(1),
    musicVideos: z.string().min(1),
    radioStations: z.string().min(1),
    allowProfitPerformances: z.string().min(1),
    country: z.string().min(1),
});

export type TLicenseSettingsSchema = z.infer<typeof licenseSettingsSchema>;