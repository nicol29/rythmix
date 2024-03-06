"use server";

import Users from "@/models/Users";
import connectMongoDB from "@/config/mongoDBConnection";
import { TProfileSettingsSchema } from "@/schemas/profileSettingsSchema";
import { revalidatePath } from "next/cache";
import { MongoError } from "mongodb";


export const updateProfileInfo = async (formData: TProfileSettingsSchema, userId: string) => {
  try {
    await connectMongoDB();

    await Users.findOneAndUpdate(
      { _id: userId },
      { $set: { 
        userName: formData.userName,
        profileUrl: formData.profileUrl,
        biography: formData.biography,
        country: formData.country,
      }}
    ) 

    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    if ((error as MongoError).code === 11000) {
      return { success: false, message: "Profile Url already exists", duplicateKey: true };
    }
    return { success: false, message: "Something went wrong", duplicateKey: false };
  }
}

export const updateLicenseSetting = async () => {

}

export const updateNotificationSetting = async () => {

}

